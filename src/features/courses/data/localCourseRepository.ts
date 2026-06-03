import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course, CourseInput } from '../domain/courseTypes';

const COURSES_STORAGE_KEY = 'runners-hi:courses';

function createLocalId() {
  return `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readCourses() {
  const rawCourses = await AsyncStorage.getItem(COURSES_STORAGE_KEY);

  if (!rawCourses) {
    return [];
  }

  try {
    return JSON.parse(rawCourses) as Course[];
  } catch {
    return [];
  }
}

async function writeCourses(courses: Course[]) {
  await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
}

export const localCourseRepository = {
  async save(courseInput: CourseInput) {
    const courses = await readCourses();
    const existingCourse = courses.find(
      (course) => course.sourceRunId === courseInput.sourceRunId
    );

    if (existingCourse) {
      return existingCourse;
    }

    const savedCourse: Course = {
      ...courseInput,
      id: createLocalId(),
      createdAt: new Date().toISOString()
    };

    await writeCourses([savedCourse, ...courses]);
    return savedCourse;
  },

  async findAll() {
    return readCourses();
  },

  async findById(id: string) {
    const courses = await readCourses();
    return courses.find((course) => course.id === id) ?? null;
  },

  async existsBySourceRunId(sourceRunId: string) {
    const courses = await readCourses();
    return courses.some((course) => course.sourceRunId === sourceRunId);
  }
};
