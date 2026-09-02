/**
 * Seed the octofit_db database with test data
 * 
 * This script populates the octofit_db MongoDB database with comprehensive test data
 * for the OctoFit Tracker multi-tier fitness application.
 * 
 * Test Data Seeded:
 * - 5 User Profiles: Sample users with diverse fitness specializations
 *   * Alice Johnson (@alice_runner) - Marathon trainer
 *   * Bob Smith (@bob_cyclist) - Mountain bike expert
 *   * Carol Williams (@carol_swimmer) - Triathlon athlete
 *   * David Brown (@david_yogi) - Yoga instructor
 *   * Emma Davis (@emma_crossfit) - CrossFit coach
 * 
 * - 3 Teams: Pre-configured fitness teams with members
 *   * Morning Runners (Led by Alice, 3 members)
 *   * Fitness Warriors (Led by Emma, 3 members)
 *   * Weekend Warriors (Led by Bob, 2 members)
 * 
 * - 10 Activities: Realistic fitness activity logs
 *   * 2 Running activities (350 cal, 520 cal)
 *   * 2 Cycling activities (650 cal, 900 cal)
 *   * 2 Swimming activities (500 cal, 700 cal)
 *   * 2 Yoga activities (200 cal, 150 cal)
 *   * 2 Gym/CrossFit activities (800 cal, 1200 cal)
 *   Total: 7,420 calories across all activities
 * 
 * - 5 Leaderboard Entries: Auto-calculated rankings
 *   * Emma Davis - 200 points (2000 total calories)
 *   * Bob Smith - 155 points (1550 total calories)
 *   * Carol Williams - 120 points (1200 total calories)
 *   * Alice Johnson - 87 points (870 total calories)
 *   * David Brown - 35 points (350 total calories)
 *   Scoring Formula: Points = Math.ceil(calories / 10)
 * 
 * - 6 Workout Plans: Personalized fitness programs
 *   * Marathon Training (60 min, Advanced Cardio)
 *   * Speed Work (45 min, Advanced Cardio)
 *   * Mountain Bike Skills (90 min, Advanced Sports)
 *   * Triathlon Preparation (120 min, Advanced Cardio)
 *   * Yoga for Flexibility (60 min, Intermediate Flexibility)
 *   * CrossFit WOD (45 min, Advanced Strength)
 * 
 * Total Documents Created: 29
 * Database: octofit_db
 * Collections: users, activities, teams, leaderboards, workouts
 * 
 * Usage:
 *   npm run seed --prefix octofit-tracker/backend
 * 
 * Note: This script clears all existing data before seeding.
 */

import mongoose from 'mongoose';
import User from '../models/User';
import Activity from '../models/Activity';
import Team from '../models/Team';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to octofit_db');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Activity.deleteMany({}),
      Team.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);
    console.log('✅ Database cleared');

    // Create sample users
    console.log('\n👥 Creating users...');
    const users = await User.insertMany([
      {
        username: 'alice_runner',
        email: 'alice@example.com',
        password: 'hashed_password_1',
        firstName: 'Alice',
        lastName: 'Johnson',
        bio: 'Marathon enthusiast and running coach 🏃‍♀️',
        profilePicture: 'https://via.placeholder.com/150?text=Alice',
      },
      {
        username: 'bob_cyclist',
        email: 'bob@example.com',
        password: 'hashed_password_2',
        firstName: 'Bob',
        lastName: 'Smith',
        bio: 'Mountain bike lover and fitness tracker 🚴‍♂️',
        profilePicture: 'https://via.placeholder.com/150?text=Bob',
      },
      {
        username: 'carol_swimmer',
        email: 'carol@example.com',
        password: 'hashed_password_3',
        firstName: 'Carol',
        lastName: 'Williams',
        bio: 'Triathlon athlete and swimming instructor 🏊‍♀️',
        profilePicture: 'https://via.placeholder.com/150?text=Carol',
      },
      {
        username: 'david_yogi',
        email: 'david@example.com',
        password: 'hashed_password_4',
        firstName: 'David',
        lastName: 'Brown',
        bio: 'Yoga instructor and mindfulness coach 🧘‍♂️',
        profilePicture: 'https://via.placeholder.com/150?text=David',
      },
      {
        username: 'emma_crossfit',
        email: 'emma@example.com',
        password: 'hashed_password_5',
        firstName: 'Emma',
        lastName: 'Davis',
        bio: 'CrossFit enthusiast and personal trainer 💪',
        profilePicture: 'https://via.placeholder.com/150?text=Emma',
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create teams
    console.log('\n🏆 Creating teams...');
    const teams = await Team.insertMany([
      {
        name: 'Morning Runners',
        description: 'Early bird runners club focused on endurance',
        leader: users[0]._id,
        members: [users[0]._id, users[1]._id, users[2]._id],
      },
      {
        name: 'Fitness Warriors',
        description: 'Hardcore fitness enthusiasts pushing limits',
        leader: users[4]._id,
        members: [users[4]._id, users[0]._id, users[3]._id],
      },
      {
        name: 'Weekend Warriors',
        description: 'Casual weekend fitness group',
        leader: users[1]._id,
        members: [users[1]._id, users[2]._id],
      },
    ]);
    console.log(`✅ Created ${teams.length} teams`);

    // Create activities
    console.log('\n🏃 Creating activities...');
    const activities = await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'running',
        duration: 30,
        distance: 5.5,
        calories: 350,
        date: new Date('2026-09-01'),
        description: 'Morning run in Central Park',
      },
      {
        user: users[0]._id,
        type: 'running',
        duration: 45,
        distance: 8.2,
        calories: 520,
        date: new Date('2026-08-31'),
        description: 'Evening run with team',
      },
      {
        user: users[1]._id,
        type: 'cycling',
        duration: 60,
        distance: 25,
        calories: 650,
        date: new Date('2026-09-01'),
        description: 'Mountain bike trail ride',
      },
      {
        user: users[1]._id,
        type: 'cycling',
        duration: 90,
        distance: 35,
        calories: 900,
        date: new Date('2026-08-30'),
        description: 'Long distance road cycling',
      },
      {
        user: users[2]._id,
        type: 'swimming',
        duration: 45,
        distance: 2,
        calories: 500,
        date: new Date('2026-09-01'),
        description: 'Pool swimming - 2km',
      },
      {
        user: users[2]._id,
        type: 'swimming',
        duration: 60,
        distance: 3,
        calories: 700,
        date: new Date('2026-08-29'),
        description: 'Open water swimming',
      },
      {
        user: users[3]._id,
        type: 'yoga',
        duration: 60,
        calories: 200,
        date: new Date('2026-09-01'),
        description: 'Morning yoga and meditation',
      },
      {
        user: users[3]._id,
        type: 'yoga',
        duration: 45,
        calories: 150,
        date: new Date('2026-08-31'),
        description: 'Evening power yoga',
      },
      {
        user: users[4]._id,
        type: 'gym',
        duration: 90,
        calories: 800,
        date: new Date('2026-09-01'),
        description: 'Full body strength training',
      },
      {
        user: users[4]._id,
        type: 'gym',
        duration: 120,
        calories: 1200,
        date: new Date('2026-08-30'),
        description: 'CrossFit workout - benchmark WOD',
      },
    ]);
    console.log(`✅ Created ${activities.length} activities`);

    // Create leaderboard entries
    console.log('\n📊 Creating leaderboard entries...');
    const leaderboardEntries = await Leaderboard.insertMany([
      {
        user: users[0]._id,
        team: teams[0]._id,
        totalPoints: Math.ceil((350 + 520) / 10),
        activitiesCount: 2,
        totalCalories: 870,
      },
      {
        user: users[1]._id,
        team: teams[2]._id,
        totalPoints: Math.ceil((650 + 900) / 10),
        activitiesCount: 2,
        totalCalories: 1550,
      },
      {
        user: users[2]._id,
        team: teams[0]._id,
        totalPoints: Math.ceil((500 + 700) / 10),
        activitiesCount: 2,
        totalCalories: 1200,
      },
      {
        user: users[3]._id,
        team: teams[1]._id,
        totalPoints: Math.ceil((200 + 150) / 10),
        activitiesCount: 2,
        totalCalories: 350,
      },
      {
        user: users[4]._id,
        team: teams[1]._id,
        totalPoints: Math.ceil((800 + 1200) / 10),
        activitiesCount: 2,
        totalCalories: 2000,
      },
    ]);
    console.log(`✅ Created ${leaderboardEntries.length} leaderboard entries`);

    // Create workouts
    console.log('\n💪 Creating workout plans...');
    const workouts = await Workout.insertMany([
      {
        user: users[0]._id,
        title: 'Marathon Training - Week 1',
        description: 'Progressive long-distance running program',
        type: 'cardio',
        duration: 60,
        difficulty: 'advanced',
        exercises: [
          { name: 'Warm-up jog', sets: 1, reps: 10 },
          { name: 'Steady pace run', sets: 1, reps: 45 },
          { name: 'Cool-down walk', sets: 1, reps: 5 },
        ],
      },
      {
        user: users[0]._id,
        title: 'Speed Work',
        description: 'Interval training for running',
        type: 'cardio',
        duration: 45,
        difficulty: 'advanced',
        exercises: [
          { name: 'Warm-up', sets: 1, reps: 5 },
          { name: '400m sprint', sets: 8, reps: 1 },
          { name: 'Recovery jog', sets: 1, reps: 5 },
        ],
      },
      {
        user: users[1]._id,
        title: 'Mountain Bike Skills',
        description: 'Technical trail riding techniques',
        type: 'sports',
        duration: 90,
        difficulty: 'advanced',
        exercises: [
          { name: 'Climb practice', sets: 4, reps: 1 },
          { name: 'Downhill technique', sets: 5, reps: 1 },
          { name: 'Obstacle navigation', sets: 3, reps: 5 },
        ],
      },
      {
        user: users[2]._id,
        title: 'Triathlon Preparation',
        description: 'Combined endurance training',
        type: 'cardio',
        duration: 120,
        difficulty: 'advanced',
        exercises: [
          { name: 'Swimming', sets: 1, reps: 30 },
          { name: 'Cycling', sets: 1, reps: 60 },
          { name: 'Running', sets: 1, reps: 30 },
        ],
      },
      {
        user: users[3]._id,
        title: 'Yoga for Flexibility',
        description: 'Daily yoga practice for flexibility and balance',
        type: 'flexibility',
        duration: 60,
        difficulty: 'intermediate',
        exercises: [
          { name: 'Sun salutation', sets: 5, reps: 1 },
          { name: 'Forward fold', sets: 3, reps: 30 },
          { name: 'Pigeon pose', sets: 2, reps: 1 },
          { name: 'Meditation', sets: 1, reps: 10 },
        ],
      },
      {
        user: users[4]._id,
        title: 'CrossFit WOD - Murph',
        description: 'Classic CrossFit workout of the day',
        type: 'strength',
        duration: 45,
        difficulty: 'advanced',
        exercises: [
          { name: 'Pull-ups', sets: 100, reps: 1 },
          { name: 'Push-ups', sets: 200, reps: 1 },
          { name: 'Air squats', sets: 300, reps: 1 },
        ],
      },
    ]);
    console.log(`✅ Created ${workouts.length} workout plans`);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 DATABASE POPULATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Users created:              ${users.length}`);
    console.log(`✅ Teams created:              ${teams.length}`);
    console.log(`✅ Activities logged:          ${activities.length}`);
    console.log(`✅ Leaderboard entries:        ${leaderboardEntries.length}`);
    console.log(`✅ Workout plans:              ${workouts.length}`);
    console.log('='.repeat(60));
    console.log('\n📊 Top Users by Points:');
    const sortedLeaderboard = await Leaderboard.find()
      .sort({ totalPoints: -1 })
      .populate('user', 'username firstName lastName')
      .limit(5);

    sortedLeaderboard.forEach((entry, index) => {
      const user = (entry as any).user;
      console.log(
        `  ${index + 1}. ${user.firstName} ${user.lastName} (@${user.username}) - ${entry.totalPoints} pts`
      );
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n💡 You can now start the API server:');
    console.log('   npm run dev --prefix octofit-tracker/backend');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
