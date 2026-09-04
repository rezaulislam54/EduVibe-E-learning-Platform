const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    default: 'pdf',
  },
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    required: [true, 'Lesson video URL is required'],
  },
  duration: {
    type: Number, // in minutes
    default: 10,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  resources: [resourceSchema],
  order: {
    type: Number,
    default: 1,
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Course subtitle is required'],
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course detailed description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science & AI',
        'Cloud & DevOps',
        'Design & UI/UX',
        'Cybersecurity',
        'Business & Marketing',
      ],
      default: 'Web Development',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    language: {
      type: String,
      default: 'English',
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price must be 0 or higher'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    },
    trailerUrl: {
      type: String,
      default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: [String],
      default: [],
    },
    sections: [sectionSchema],
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'published',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function () {
  if (!this.sections) return 0;
  return this.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0);
});

// Virtual for total duration in minutes
courseSchema.virtual('totalDurationMinutes').get(function () {
  if (!this.sections) return 0;
  return this.sections.reduce((acc, sec) => {
    const secDuration = sec.lessons
      ? sec.lessons.reduce((lAcc, les) => lAcc + (les.duration || 0), 0)
      : 0;
    return acc + secDuration;
  }, 0);
});

// Create slug before saving
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  if (this.price === 0) {
    this.isFree = true;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
