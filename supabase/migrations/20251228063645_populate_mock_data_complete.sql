/*
  # Populate Database with Mock Course Data

  Populates 6 courses with complete data including instructors, learning outcomes,
  highlights, curriculum, schedules, pricing, reviews, FAQs, and prerequisites.
*/

DO $$
DECLARE
  sarah_id uuid;
  david_id uuid;
  emily_id uuid;
  chess_id uuid;
  speaking_id uuid;
  math_id uuid;
  drawing_id uuid;
  science_id uuid;
  coding_id uuid;
BEGIN
  -- Insert instructors
  INSERT INTO instructors (name, photo, bio, years_experience, specialization, is_online)
  VALUES ('Sarah Johnson', '👩‍🏫', 'International Chess Master with 12+ years teaching children', 12, 'Chess Strategy & Youth Education', true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO sarah_id;
  IF sarah_id IS NULL THEN SELECT id INTO sarah_id FROM instructors WHERE name = 'Sarah Johnson' LIMIT 1; END IF;

  INSERT INTO instructors (name, photo, bio, years_experience, specialization, is_online)
  VALUES ('David Chen', '👨‍🏫', 'Public speaking coach and communication expert', 8, 'Communication & Presentation Skills', true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO david_id;
  IF david_id IS NULL THEN SELECT id INTO david_id FROM instructors WHERE name = 'David Chen' LIMIT 1; END IF;

  INSERT INTO instructors (name, photo, bio, years_experience, specialization, is_online)
  VALUES ('Emily Rodriguez', '👩‍🎓', 'Math educator passionate about making numbers fun', 10, 'Early Math Education', true)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO emily_id;
  IF emily_id IS NULL THEN SELECT id INTO emily_id FROM instructors WHERE name = 'Emily Rodriguez' LIMIT 1; END IF;

  -- Insert courses
  INSERT INTO courses (title, category, age_range, duration, description, full_description, tier, image_color, icon, rating, review_count, is_popular, is_locked, spots_left, viewing_now, instructor_id, status)
  VALUES ('Chess for Beginners', 'Chess', '6-10', '8 weeks', 'Learn the fundamentals of chess strategy and tactics', 'This comprehensive chess course is designed specifically for young minds aged 6-10. Through interactive lessons and engaging activities, children will master the basics of chess while developing critical thinking, problem-solving, and strategic planning skills that benefit them far beyond the chessboard.', 'premium', 'from-blue-500 to-blue-600', '♟️', 4.96, 298, true, false, 3, 12, sarah_id, 'published')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO chess_id;
  IF chess_id IS NULL THEN SELECT id INTO chess_id FROM courses WHERE title = 'Chess for Beginners' LIMIT 1; END IF;

  INSERT INTO courses (title, category, age_range, duration, description, full_description, tier, image_color, icon, rating, review_count, is_popular, is_locked, spots_left, viewing_now, instructor_id, status)
  VALUES ('Public Speaking for Kids', 'Communication', '8-12', '6 weeks', 'Build confidence and master presentation skills', 'Transform your child from a shy speaker to a confident presenter! This course teaches children aged 8-12 essential public speaking and presentation skills through interactive exercises, fun activities, and supportive feedback.', 'premium', 'from-orange-500 to-orange-600', '💬', 4.93, 186, true, false, 5, 8, david_id, 'published')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO speaking_id;
  IF speaking_id IS NULL THEN SELECT id INTO speaking_id FROM courses WHERE title = 'Public Speaking for Kids' LIMIT 1; END IF;

  INSERT INTO courses (title, category, age_range, duration, description, full_description, tier, image_color, icon, rating, review_count, is_popular, is_locked, spots_left, viewing_now, instructor_id, status)
  VALUES ('Fun with Numbers', 'Math', '5-8', '10 weeks', 'Make math exciting with games and puzzles', 'Turn math anxiety into math excitement! This engaging course makes numbers fun through games, puzzles, and hands-on activities.', 'mini', 'from-red-500 to-pink-500', '🔢', 4.89, 142, false, false, 8, 6, emily_id, 'published')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO math_id;
  IF math_id IS NULL THEN SELECT id INTO math_id FROM courses WHERE title = 'Fun with Numbers' LIMIT 1; END IF;

  INSERT INTO courses (title, category, age_range, duration, description, full_description, tier, image_color, icon, rating, review_count, is_popular, is_locked, spots_left, viewing_now, instructor_id, status)
  VALUES ('Creative Drawing', 'Creativity', '4-9', '12 weeks', 'Explore different art techniques and styles', 'Unlock your child''s artistic potential! This comprehensive drawing course introduces young artists to various techniques, styles, and mediums.', 'mini', 'from-pink-500 to-rose-500', '🎨', 4.91, 167, false, false, 6, 9, emily_id, 'published')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO drawing_id;
  IF drawing_id IS NULL THEN SELECT id INTO drawing_id FROM courses WHERE title = 'Creative Drawing' LIMIT 1; END IF;

  INSERT INTO courses (title, category, age_range, duration, description, full_description, tier, image_color, icon, rating, review_count, is_popular, is_locked, spots_left, viewing_now, instructor_id, status)
  VALUES ('Science Explorers', 'Science', '7-11', '8 weeks', 'Hands-on experiments and discovery', 'Ignite your child''s curiosity about the world! Science Explorers brings science to life through exciting hands-on experiments.', 'mini', 'from-green-500 to-emerald-600', '🔬', 4.94, 203, true, false, 4, 11, emily_id, 'published')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO science_id;
  IF science_id IS NULL THEN SELECT id INTO science_id FROM courses WHERE title = 'Science Explorers' LIMIT 1; END IF;

  INSERT INTO courses (title, category, age_range, duration, description, full_description, tier, image_color, icon, rating, review_count, is_popular, is_locked, spots_left, viewing_now, instructor_id, status)
  VALUES ('Scratch Programming', 'Coding', '8-14', '10 weeks', 'Learn coding through game creation', 'Launch your child into the world of coding! Using Scratch, students will learn fundamental programming concepts by creating games.', 'premium', 'from-cyan-500 to-blue-500', '💻', 4.97, 241, true, false, 2, 15, sarah_id, 'published')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title RETURNING id INTO coding_id;
  IF coding_id IS NULL THEN SELECT id INTO coding_id FROM courses WHERE title = 'Scratch Programming' LIMIT 1; END IF;

  -- Delete existing related data
  DELETE FROM learning_outcomes WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_highlights WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM curriculum_modules WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_schedules WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_pricing WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_reviews WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_faqs WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_prerequisites WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);
  DELETE FROM course_relations WHERE course_id IN (chess_id, speaking_id, math_id, drawing_id, science_id, coding_id);

  -- Insert Learning Outcomes
  INSERT INTO learning_outcomes (course_id, text, icon, order_position) VALUES
    (chess_id, 'Master all chess pieces and their movements', '♟️', 0),
    (chess_id, 'Understand opening principles and strategies', '🎯', 1),
    (chess_id, 'Learn tactical patterns like forks and pins', '⚡', 2),
    (chess_id, 'Develop critical thinking and planning skills', '🧠', 3),
    (chess_id, 'Play complete games with confidence', '🏆', 4),
    (chess_id, 'Analyze positions and make smart decisions', '🔍', 5),
    (speaking_id, 'Overcome fear and speak confidently in public', '🎤', 0),
    (speaking_id, 'Structure and organize compelling presentations', '📝', 1),
    (speaking_id, 'Use body language and voice effectively', '👋', 2),
    (speaking_id, 'Engage and connect with any audience', '👥', 3),
    (speaking_id, 'Handle questions and impromptu speaking', '💡', 4),
    (speaking_id, 'Build lasting self-confidence', '⭐', 5),
    (math_id, 'Master basic addition and subtraction', '➕', 0),
    (math_id, 'Understand numbers and counting to 100', '🔢', 1),
    (math_id, 'Recognize patterns and sequences', '🎯', 2),
    (math_id, 'Solve age-appropriate word problems', '📖', 3),
    (math_id, 'Build confidence with numbers', '💪', 4),
    (math_id, 'Develop logical thinking skills', '🧠', 5),
    (drawing_id, 'Master basic drawing techniques', '✏️', 0),
    (drawing_id, 'Understand colors and shading', '🎨', 1),
    (drawing_id, 'Create drawings from imagination', '💭', 2),
    (drawing_id, 'Develop fine motor skills', '✋', 3),
    (drawing_id, 'Express creativity with confidence', '⭐', 4),
    (drawing_id, 'Appreciate different art styles', '🖼️', 5),
    (science_id, 'Understand the scientific method', '🔬', 0),
    (science_id, 'Conduct safe experiments at home', '⚗️', 1),
    (science_id, 'Explore physics, chemistry, and biology', '🧪', 2),
    (science_id, 'Think critically and ask questions', '❓', 3),
    (science_id, 'Record and analyze observations', '📊', 4),
    (science_id, 'Develop a love for science', '💚', 5),
    (coding_id, 'Understand core programming concepts', '💡', 0),
    (coding_id, 'Create interactive games and animations', '🎮', 1),
    (coding_id, 'Debug and solve coding problems', '🐛', 2),
    (coding_id, 'Think logically and sequentially', '🧩', 3),
    (coding_id, 'Design user-friendly interfaces', '🎨', 4),
    (coding_id, 'Build a portfolio of projects', '📂', 5);

  -- Insert Course Highlights
  INSERT INTO course_highlights (course_id, text, included, order_position) VALUES
    (chess_id, 'Live interactive sessions with expert instructor', true, 0),
    (chess_id, 'Downloadable practice materials and worksheets', true, 1),
    (chess_id, 'Certificate of completion', true, 2),
    (chess_id, 'Recorded sessions for review', true, 3),
    (chess_id, 'Access to online chess practice platform', true, 4),
    (chess_id, 'Parent progress reports', true, 5),
    (speaking_id, 'Live interactive sessions with practice time', true, 0),
    (speaking_id, 'Personalized feedback on presentations', true, 1),
    (speaking_id, 'Certificate of completion', true, 2),
    (speaking_id, 'Recorded sessions for review', true, 3),
    (speaking_id, 'Public speaking toolkit and templates', true, 4),
    (speaking_id, 'Final showcase presentation', true, 5),
    (math_id, 'Game-based learning approach', true, 0),
    (math_id, 'Interactive digital activities', true, 1),
    (math_id, 'Printable worksheets and games', true, 2),
    (math_id, 'Weekly progress reports', true, 3),
    (math_id, 'Certificate of achievement', true, 4),
    (drawing_id, 'Step-by-step drawing tutorials', true, 0),
    (drawing_id, 'Art supply recommendations', true, 1),
    (drawing_id, 'Digital gallery for student work', true, 2),
    (drawing_id, 'Weekly creative challenges', true, 3),
    (drawing_id, 'Certificate and portfolio', true, 4),
    (science_id, 'Live experiment demonstrations', true, 0),
    (science_id, 'Detailed experiment guides', true, 1),
    (science_id, 'Science journal templates', true, 2),
    (science_id, 'Safe household materials only', true, 3),
    (science_id, 'Certificate of completion', true, 4),
    (coding_id, 'Live coding sessions with instructor', true, 0),
    (coding_id, 'Project-based learning approach', true, 1),
    (coding_id, 'Access to Scratch online community', true, 2),
    (coding_id, 'Certificate of completion', true, 3),
    (coding_id, 'Recorded sessions for review', true, 4),
    (coding_id, 'Final game showcase event', true, 5);

  -- Insert Curriculum (abbreviated for brevity)
  INSERT INTO curriculum_modules (course_id, week_number, title, description, order_position) VALUES
    (chess_id, 1, 'Introduction to Chess', 'Learn the board, pieces, and basic rules', 0),
    (chess_id, 2, 'Piece Power', 'Master how each piece moves', 1),
    (chess_id, 3, 'Opening Principles', 'Start games with smart moves', 2),
    (chess_id, 4, 'Tactical Patterns', 'Discover forks, pins, skewers', 3),
    (chess_id, 5, 'Middle Game Strategy', 'Plan attacks and defense', 4),
    (chess_id, 6, 'Endgame Basics', 'Learn to checkmate', 5),
    (chess_id, 7, 'Practice Games', 'Apply everything learned', 6),
    (chess_id, 8, 'Tournament Prep', 'Final confidence building', 7),
    (speaking_id, 1, 'Breaking the Ice', 'Build confidence', 0),
    (speaking_id, 2, 'Voice & Body Language', 'Master non-verbal communication', 1),
    (speaking_id, 3, 'Story Structure', 'Organize compelling narratives', 2),
    (speaking_id, 4, 'Engaging Your Audience', 'Capture attention', 3),
    (speaking_id, 5, 'Handling Q&A', 'Respond confidently', 4),
    (speaking_id, 6, 'Final Presentations', 'Showcase new skills', 5),
    (math_id, 1, 'Number Friends', 'Meet numbers 1-20', 0),
    (math_id, 2, 'Counting Adventures', 'Count to 50 and beyond', 1),
    (math_id, 3, 'Addition Magic', 'Learn to add', 2),
    (math_id, 4, 'Subtraction Safari', 'Subtract with fun', 3),
    (math_id, 5, 'Pattern Detectives', 'Discover patterns', 4),
    (math_id, 6, 'Shape & Number Party', 'Combine shapes with counting', 5),
    (math_id, 7, 'Word Problem Heroes', 'Solve real-world problems', 6),
    (math_id, 8, 'Number Games Tournament', 'Competitive math games', 7),
    (math_id, 9, 'Math in Everyday Life', 'Find math everywhere', 8),
    (math_id, 10, 'Math Champions', 'Celebrate progress', 9);

  -- Insert Schedules with JSONB casting
  INSERT INTO course_schedules (course_id, days_per_week, duration, session_length, total_sessions, next_batch_date, time_slots) VALUES
    (chess_id, 2, '8 weeks', '45 minutes', 16, '2026-01-15', to_jsonb(ARRAY['4:00 PM - 4:45 PM', '5:00 PM - 5:45 PM', '6:00 PM - 6:45 PM'])),
    (speaking_id, 2, '6 weeks', '60 minutes', 12, '2026-01-20', to_jsonb(ARRAY['4:00 PM - 5:00 PM', '5:30 PM - 6:30 PM', '6:30 PM - 7:30 PM'])),
    (math_id, 2, '10 weeks', '30 minutes', 20, '2026-01-18', to_jsonb(ARRAY['3:30 PM - 4:00 PM', '4:30 PM - 5:00 PM', '5:30 PM - 6:00 PM'])),
    (drawing_id, 1, '12 weeks', '45 minutes', 12, '2026-01-22', to_jsonb(ARRAY['4:00 PM - 4:45 PM', '5:00 PM - 5:45 PM', '6:00 PM - 6:45 PM'])),
    (science_id, 2, '8 weeks', '45 minutes', 16, '2026-01-16', to_jsonb(ARRAY['4:00 PM - 4:45 PM', '5:00 PM - 5:45 PM', '6:00 PM - 6:45 PM'])),
    (coding_id, 2, '10 weeks', '60 minutes', 20, '2026-01-17', to_jsonb(ARRAY['4:00 PM - 5:00 PM', '5:30 PM - 6:30 PM', '6:30 PM - 7:30 PM']));

  -- Insert Pricing with JSONB casting
  INSERT INTO course_pricing (course_id, original_price, discounted_price, currency, per_session_price, payment_plans, money_back_guarantee, free_trial) VALUES
    (chess_id, 12999, 9999, 'INR', 625, to_jsonb(ARRAY['Full payment', '2 installments', '4 installments']), true, true),
    (speaking_id, 9999, 7999, 'INR', 667, to_jsonb(ARRAY['Full payment', '2 installments']), true, true),
    (math_id, 5999, 4499, 'INR', 225, to_jsonb(ARRAY['Full payment', '2 installments']), true, false),
    (drawing_id, 4999, 3999, 'INR', 333, to_jsonb(ARRAY['Full payment', '3 installments']), true, false),
    (science_id, 6999, 5499, 'INR', 344, to_jsonb(ARRAY['Full payment', '2 installments']), true, false),
    (coding_id, 14999, 11999, 'INR', 600, to_jsonb(ARRAY['Full payment', '2 installments', '4 installments']), true, true);

  -- Insert Reviews with JSONB casting for images
  INSERT INTO course_reviews (course_id, parent_name, parent_photo, rating, comment, review_date, verified, images, helpful_count) VALUES
    (chess_id, 'Jennifer M.', '👤', 5, 'My son went from not knowing how to play to competing in school tournaments!', '2025-12-10', true, to_jsonb(ARRAY['https://images.pexels.com/photos/277124/pexels-photo-277124.jpeg']), 42),
    (chess_id, 'Michael T.', '👤', 5, 'Best investment we made in our daughter''s education.', '2025-12-05', true, '[]'::jsonb, 38),
    (chess_id, 'Priya S.', '👤', 5, 'Excellent curriculum and patient instruction. Worth every penny!', '2025-11-28', true, '[]'::jsonb, 25),
    (speaking_id, 'Amanda K.', '👤', 5, 'My shy daughter now volunteers to present in class!', '2025-12-12', true, to_jsonb(ARRAY['https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg']), 35),
    (speaking_id, 'Robert H.', '👤', 5, 'Incredible transformation! Best course ever!', '2025-12-08', true, '[]'::jsonb, 28),
    (math_id, 'Sarah P.', '👤', 5, 'My daughter used to hate math, now she asks to do extra problems!', '2025-12-15', true, '[]'::jsonb, 31),
    (math_id, 'John D.', '👤', 5, 'The game-based approach is brilliant!', '2025-12-10', true, '[]'::jsonb, 27),
    (drawing_id, 'Maria G.', '👤', 5, 'My daughter''s artistic skills have blossomed!', '2025-12-14', true, to_jsonb(ARRAY['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg']), 29),
    (science_id, 'Patricia M.', '👤', 5, 'My son is obsessed with science now!', '2025-12-13', true, '[]'::jsonb, 33),
    (coding_id, 'Rachel T.', '👤', 5, 'My son created his first game in 4 weeks!', '2025-12-11', true, '[]'::jsonb, 40);

  -- Insert FAQs
  INSERT INTO course_faqs (course_id, question, answer, order_position) VALUES
    (chess_id, 'Does my child need any prior chess knowledge?', 'No prior knowledge needed! This course is designed for complete beginners.', 0),
    (chess_id, 'What if my child misses a class?', 'All sessions are recorded and available for review.', 1),
    (speaking_id, 'Is this course suitable for shy children?', 'Absolutely! This course is specifically designed to help shy children build confidence.', 0),
    (math_id, 'My child struggles with math. Is this suitable?', 'Absolutely! This course makes math fun and accessible for all levels.', 0),
    (drawing_id, 'What art supplies does my child need?', 'Basic supplies: paper, pencils, eraser, colored pencils or crayons.', 0),
    (science_id, 'Are the experiments safe to do at home?', 'Absolutely! All experiments use safe, common household materials.', 0),
    (coding_id, 'Does my child need any coding experience?', 'No prior experience needed! Scratch is designed for complete beginners.', 0);

  -- Insert Prerequisites
  INSERT INTO course_prerequisites (course_id, prerequisite_text, order_position) VALUES
    (chess_id, 'Basic computer skills', 0),
    (chess_id, 'Ability to focus for 45 minutes', 1),
    (chess_id, 'Enthusiasm to learn', 2),
    (speaking_id, 'Willingness to try new things', 0),
    (math_id, 'Basic counting to 10', 0),
    (drawing_id, 'Ability to hold a pencil', 0),
    (science_id, 'Curiosity about the world', 0),
    (coding_id, 'Basic computer skills', 0);

  -- Insert Course Relations
  INSERT INTO course_relations (course_id, related_course_id) VALUES
    (chess_id, speaking_id), (chess_id, coding_id),
    (speaking_id, chess_id), (speaking_id, coding_id),
    (math_id, science_id), (math_id, drawing_id),
    (drawing_id, math_id), (drawing_id, science_id),
    (science_id, math_id), (science_id, coding_id),
    (coding_id, chess_id), (coding_id, speaking_id);

END $$;
