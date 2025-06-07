import pool from '../models/db.js';

export const createGroup = async (req, res) => {
  const { name, description, creatorUserId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const groupResult = await client.query(
      'INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING id',
      [name, description]
    );
    const groupId = groupResult.rows[0].id;

    // Add creator as admin
    await client.query(
      'INSERT INTO group_members (group_id, user_id, role_id) VALUES ($1, $2, $3)',
      [groupId, creatorUserId, 1] // 1 = admin
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Group created', groupId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Could not create group' });
  } finally {
    client.release();
  }
};


export const addUserToGroup = async (req, res) => {
  const { userId, groupId } = req.body;
  try {
    await pool.query(
  'INSERT INTO group_members (group_id, user_id, role_id) VALUES ($1, $2, $3)',
  [groupId, userId, 2] // 2 = member
);
    res.status(201).json({ message: 'User added to group' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not add user to group' });
  }
};

export const getGroupNotes = async (req, res) => {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      `SELECT n.* FROM notes n
       JOIN users u ON n.user_id = u.id
       JOIN group_members gm ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY n.created_at DESC`,
      [groupId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch group notes' });
  }
};

export const createGroupInvite = async (req, res) => {
  const { groupId, invitedUserId, invitedByUserId } = req.body;
  try {
    await pool.query(
      `INSERT INTO group_invites (group_id, invited_user_id, invited_by_user_id)
       VALUES ($1, $2, $3)`,
      [groupId, invitedUserId, invitedByUserId]
    );
    res.status(201).json({ message: 'Invite sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not send invite' });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const result = await pool.query(
      'UPDATE group_members SET role_id = 1 WHERE group_id = $1 AND user_id = $2 RETURNING *',
      [groupId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found in group' });
    }

    res.status(200).json({ message: 'User promoted to admin' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not promote user' });
  }
};

export const leaveGroup = async (req, res) => {
  const { groupId, userId, transferToUserId, deleteGroup } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Hämta roll för user som lämnar
    const userRoleResult = await client.query(
      'SELECT role_id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    if (userRoleResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found in group' });
    }

    const isAdmin = userRoleResult.rows[0].role_id === 1;

    // Om user är admin → kolla hur många andra admins finns
    if (isAdmin) {
      const otherAdminsResult = await client.query(
        'SELECT COUNT(*) FROM group_members WHERE group_id = $1 AND role_id = 1 AND user_id != $2',
        [groupId, userId]
      );

      const otherAdminsCount = parseInt(otherAdminsResult.rows[0].count, 10);

      if (otherAdminsCount === 0) {
        // Ingen annan admin kvar
        if (deleteGroup) {
          // Ta bort hela gruppen
          await client.query('DELETE FROM group_members WHERE group_id = $1', [groupId]);
          await client.query('DELETE FROM groups WHERE id = $1', [groupId]);

          await client.query('COMMIT');
          return res.status(200).json({ message: 'Group deleted' });
        } else if (transferToUserId) {
          // Ge admin till annan user
          await client.query(
            'UPDATE group_members SET role_id = 1 WHERE group_id = $1 AND user_id = $2',
            [groupId, transferToUserId]
          );
        } else {
          await client.query('ROLLBACK');
          return res.status(400).json({
            error: 'No other admin in group. Must delete group or transfer admin role first.',
          });
        }
      }
    }

    // Ta bort user från group_members
    await client.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'User left group' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Could not leave group' });
  } finally {
    client.release();
  }
};
