const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Discussion = require('../models/Discussion');
const { sampleUsers, sampleCourses } = require('./seedData');

dotenv.config({ path: __dirname + '/../.env' });

const seedDB = async () => {
  try {
    console.log('🌱 Clearing existing collections...');
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Discussion.deleteMany();

    console.log('👤 Seeding Users...');
    const createdUsers = await User.create(sampleUsers);

    const instructorMap = {
      'Sarah Jenkins': createdUsers.find((u) => u.email === 'sarah.instructor@eduvibe.com'),
      'Michael Chen': createdUsers.find((u) => u.email === 'michael.instructor@eduvibe.com'),
      'David Miller': createdUsers.find((u) => u.email === 'david.instructor@eduvibe.com'),
    };
    const studentUser = createdUsers.find((u) => u.email === 'student@eduvibe.com');
    const emilyStudent = createdUsers.find((u) => u.email === 'emily@eduvibe.com');

    console.log('📚 Seeding Courses...');
    const coursePromises = sampleCourses.map((course, idx) => {
      let instructor = instructorMap['Sarah Jenkins'];
      if (course.category === 'Data Science & AI') {
        instructor = instructorMap['Michael Chen'];
      } else if (course.category === 'Design & UI/UX') {
        instructor = instructorMap['David Miller'];
      } else if (idx % 2 === 1) {
        instructor = instructorMap['Michael Chen'];
      }
      return Course.create({
        ...course,
        instructor: instructor._id,
      });
    });

    const createdCourses = await Promise.all(coursePromises);

    console.log('⭐ Seeding Reviews...');
    const reviewsToCreate = [
      {
        course: createdCourses[0]._id,
        user: studentUser._id,
        rating: 5,
        comment: 'Absolutely phenomenal masterclass! Sarah explains full-stack concepts with immense clarity. The Stripe and Socket.io sections alone were worth ten times the price!',
      },
      {
        course: createdCourses[0]._id,
        user: emilyStudent._id,
        rating: 5,
        comment: 'Helped me land my first junior software engineer interview. The project structure is clean and production ready.',
      },
      {
        course: createdCourses[1]._id,
        user: studentUser._id,
        rating: 5,
        comment: 'The LangChain & RAG section is top tier. Practical code with zero fluff!',
      },
      {
        course: createdCourses[2]._id,
        user: emilyStudent._id,
        rating: 5,
        comment: 'The design systems walkthrough revolutionized how I create Figma components. 10/10!',
      },
    ];
    await Review.create(reviewsToCreate);

    console.log('🎓 Seeding Sample Enrollments...');
    // Enroll Alex in Course 1 with partial progress
    const course1 = createdCourses[0];
    const lesson1Id = course1.sections[0].lessons[0]._id;
    const lesson2Id = course1.sections[0].lessons[1]._id;

    const enrollment1 = await Enrollment.create({
      user: studentUser._id,
      course: course1._id,
      completedLessons: [lesson1Id, lesson2Id],
      progressPercentage: 20,
      lastAccessedLesson: lesson2Id,
      notes: [
        {
          lessonId: lesson1Id,
          lessonTitle: 'Welcome & How to Get the Most from this Course',
          noteText: 'Joined the Discord channel and cloned the starter repo for reference.',
        },
      ],
    });

    // Enroll Alex in free Cybersecurity course with 100% completed progress + certificate!
    const cyberCourse = createdCourses.find((c) => c.category === 'Cybersecurity');
    if (cyberCourse && cyberCourse.sections[0]?.lessons[0]) {
      const cyberLessonId = cyberCourse.sections[0].lessons[0]._id;
      await Enrollment.create({
        user: studentUser._id,
        course: cyberCourse._id,
        completedLessons: [cyberLessonId],
        progressPercentage: 100,
        isCompleted: true,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        certificateId: 'EDU-77X92B',
      });
      await User.findByIdAndUpdate(studentUser._id, {
        $addToSet: { enrolledCourses: [course1._id, cyberCourse._id] },
      });
    } else {
      await User.findByIdAndUpdate(studentUser._id, {
        $addToSet: { enrolledCourses: course1._id },
      });
    }

    console.log('💬 Seeding Sample Discussions / Q&A...');
    await Discussion.create({
      course: course1._id,
      lessonId: lesson1Id,
      lessonTitle: 'Welcome & How to Get the Most from this Course',
      user: studentUser._id,
      title: 'Are the slides and diagrams available for offline download?',
      content: 'Hello Sarah! Loved the intro video. Are the architectural diagrams downloadable in high resolution?',
      replies: [
        {
          user: instructorMap['Sarah Jenkins']._id,
          content: 'Hi Alex! Yes, absolutely! Check the Lesson Resources tab where I attached the high-res PDF roadmap.',
          isInstructor: true,
          createdAt: new Date(),
        },
      ],
    });

    console.log('💳 Seeding Orders...');
    await Order.create({
      user: studentUser._id,
      course: course1._id,
      amount: course1.discountPrice || course1.price,
      paymentMethod: 'stripe',
      paymentId: 'pi_sample_stripe_384917',
      status: 'completed',
    });

    console.log('✅ Database successfully populated with realistic demo data!');
  } catch (err) {
    console.error('❌ Seeding Error:', err);
  }
};

// If run directly from terminal
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedDB();
    process.exit(0);
  });
}

module.exports = seedDB;
