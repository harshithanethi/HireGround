/**
 * auth.js - Mock authentication utility using localStorage.
 * Handles user persistence and cross-role email uniqueness.
 */

const USERS_KEY = 'hg_users_v1';

const getUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const auth = {
  /**
   * signup - Creates a new user if the email is not already taken.
   */
  signup: (name, email, password, role) => {
    if (!name || !email || !password || !role) {
      throw new Error('Please fill in all fields.');
    }

    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();

    if (users.some(u => u.email === normalizedEmail)) {
      throw new Error('This email is already registered.');
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password, // In a real app, hash this!
      role,
      id: `user_${Math.floor(Math.random() * 1000000)}`,
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);

    return {
      user: newUser,
      redirect: role === 'recruiter' ? '/admin' : '/upload'
    };
  },

  /**
   * login - Verifies credentials and role.
   */
  login: (email, password, role) => {
    if (!email || !password || !role) {
      throw new Error('Please fill in all fields.');
    }

    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();

    const match = users.find(
      u => u.email === normalizedEmail && u.password === password && u.role === role
    );

    if (!match) {
      // Check if email exists with a DIFFERENT role to provide a helpful error
      const otherRole = users.find(u => u.email === normalizedEmail);
      if (otherRole) {
        throw new Error(`This account is registered as a ${otherRole.role}. Please log in with the correct role.`);
      }
      throw new Error('Invalid email or password.');
    }

    return {
      user: match,
      redirect: role === 'recruiter' ? '/admin' : '/upload'
    };
  },

  /**
   * logout - Clears session.
   */
  logout: () => {
    localStorage.removeItem('hg_access_token');
    localStorage.removeItem('hg_user');
  }
};
