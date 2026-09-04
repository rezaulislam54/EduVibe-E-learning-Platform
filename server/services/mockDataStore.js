const jwt = require('jsonwebtoken');
const { sampleUsers, sampleCourses } = require('../seed/seedData');

// Generate stable deterministic IDs
const mockUsers = sampleUsers.map((u, index) => {
  const hexId = (index + 1).toString().padStart(24, '0');
  return {
    _id: hexId,
    ...u,
    enrolledCourses: [],
    comparePassword: async function (candidatePassword) {
      return candidatePassword === 'password123' || candidatePassword === this.password;
    },
    generateAuthToken: function () {
      return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET || 'eduvibe_jwt_secret_key_default',
        { expiresIn: '30d' }
      );
    },
  };
});

const mockCourses = sampleCourses.map((c, index) => {
  const hexId = (index + 101).toString().padStart(24, '0');
  const instructor = mockUsers.find(u => u.role === 'instructor') || mockUsers[0];
  return {
    _id: hexId,
    ...c,
    status: 'published',
    instructor: {
      _id: instructor._id,
      name: instructor.name,
      avatar: instructor.avatar,
      headline: instructor.headline,
      bio: instructor.bio,
    },
    createdAt: new Date().toISOString(),
  };
});

const mockEnrollments = [
  {
    _id: '000000000000000000000201',
    user: mockUsers.find(u => u.role === 'student')?._id || mockUsers[3]._id,
    course: mockCourses[0],
    progress: 100,
    isCompleted: true,
    completedLessons: mockCourses[0]?.sections?.[0]?.lessons?.map((_, i) => `lesson_${i}`) || ['lesson_0', 'lesson_1'],
    notes: [
      {
        _id: 'note_1',
        title: 'MERN Architecture Notes',
        content: 'Remember to use proper indexing on MongoDB schemas and cache hot queries with Redis.',
        createdAt: new Date().toISOString(),
      },
    ],
    certificate: {
      certificateId: 'CERT-MERN-89241',
      issuedAt: new Date().toISOString(),
    },
    enrolledAt: new Date().toISOString(),
  },
  {
    _id: '000000000000000000000202',
    user: mockUsers.find(u => u.role === 'student')?._id || mockUsers[3]._id,
    course: mockCourses[1],
    progress: 45,
    isCompleted: false,
    completedLessons: ['lesson_0'],
    notes: [],
    enrolledAt: new Date().toISOString(),
  },
];

const mockDataStore = {
  users: mockUsers,
  courses: mockCourses,
  enrollments: mockEnrollments,
  findUserByEmail: (email) => {
    return mockUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  },
  findUserById: (id) => {
    return mockUsers.find((u) => u._id.toString() === id.toString());
  },
  findUserByRole: (role) => {
    return mockUsers.find((u) => u.role === role);
  },
  findCourseById: (id) => {
    return mockCourses.find((c) => c._id.toString() === id.toString()) || mockCourses[0];
  },
  generateToken: (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'eduvibe_jwt_secret_key_default',
      { expiresIn: '30d' }
    );
  },
};

module.exports = mockDataStore;
