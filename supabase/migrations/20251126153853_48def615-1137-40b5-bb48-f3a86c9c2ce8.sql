-- Create problems table
CREATE TABLE public.problems (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id text NOT NULL UNIQUE,
  title text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category text NOT NULL,
  statement text NOT NULL,
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  constraints text,
  tags text[] DEFAULT ARRAY[]::text[],
  test_cases jsonb NOT NULL DEFAULT '[]'::jsonb,
  starter_code jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Everyone can read problems
CREATE POLICY "Anyone can view problems"
ON public.problems
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX idx_problems_category ON public.problems(category);
CREATE INDEX idx_problems_tags ON public.problems USING GIN(tags);

-- Insert sample problems
INSERT INTO public.problems (problem_id, title, difficulty, category, statement, examples, constraints, tags, test_cases, starter_code) VALUES
('two-sum', 'Two Sum', 'Easy', 'Array', 
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
'[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}]'::jsonb,
'2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
ARRAY['Array', 'Hash Table', 'Two Pointers'],
'[{"input": {"nums": [2,7,11,15], "target": 9}, "output": [0,1]}, {"input": {"nums": [3,2,4], "target": 6}, "output": [1,2]}]'::jsonb,
'{"javascript": "function twoSum(nums, target) {\n  // Your code here\n}", "python": "def twoSum(nums, target):\n    # Your code here\n    pass", "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}", "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};"}'::jsonb
),
('valid-parentheses', 'Valid Parentheses', 'Easy', 'Stack',
'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
'[{"input": "s = \"()\"", "output": "true"}, {"input": "s = \"()[]{}\"", "output": "true"}, {"input": "s = \"(]\"", "output": "false"}]'::jsonb,
'1 <= s.length <= 10^4, s consists of parentheses only ''()[]{}''',
ARRAY['Stack', 'String'],
'[{"input": {"s": "()"}, "output": true}, {"input": {"s": "()[]{}"}, "output": true}, {"input": {"s": "(]"}, "output": false}]'::jsonb,
'{"javascript": "function isValid(s) {\n  // Your code here\n}", "python": "def isValid(s):\n    # Your code here\n    pass", "java": "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}", "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};"}'::jsonb
),
('container-with-most-water', 'Container With Most Water', 'Medium', 'Two Pointers',
'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
'[{"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49", "explanation": "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."}]'::jsonb,
'n == height.length, 2 <= n <= 10^5, 0 <= height[i] <= 10^4',
ARRAY['Two Pointers', 'Array', 'Greedy'],
'[{"input": {"height": [1,8,6,2,5,4,8,3,7]}, "output": 49}, {"input": {"height": [1,1]}, "output": 1}]'::jsonb,
'{"javascript": "function maxArea(height) {\n  // Your code here\n}", "python": "def maxArea(height):\n    # Your code here\n    pass", "java": "class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n    }\n}", "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Your code here\n    }\n};"}'::jsonb
),
('longest-substring-without-repeating', 'Longest Substring Without Repeating Characters', 'Medium', 'Sliding Window',
'Given a string s, find the length of the longest substring without repeating characters.',
'[{"input": "s = \"abcabcbb\"", "output": "3", "explanation": "The answer is \"abc\", with the length of 3."}, {"input": "s = \"bbbbb\"", "output": "1", "explanation": "The answer is \"b\", with the length of 1."}]'::jsonb,
'0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces',
ARRAY['Sliding Window', 'Hash Table', 'String'],
'[{"input": {"s": "abcabcbb"}, "output": 3}, {"input": {"s": "bbbbb"}, "output": 1}, {"input": {"s": "pwwkew"}, "output": 3}]'::jsonb,
'{"javascript": "function lengthOfLongestSubstring(s) {\n  // Your code here\n}", "python": "def lengthOfLongestSubstring(s):\n    # Your code here\n    pass", "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}", "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Your code here\n    }\n};"}'::jsonb
),
('climbing-stairs', 'Climbing Stairs', 'Easy', 'Dynamic Programming',
'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
'[{"input": "n = 2", "output": "2", "explanation": "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps"}, {"input": "n = 3", "output": "3", "explanation": "There are three ways: 1. 1 step + 1 step + 1 step, 2. 1 step + 2 steps, 3. 2 steps + 1 step"}]'::jsonb,
'1 <= n <= 45',
ARRAY['Dynamic Programming', 'Math', 'Memoization'],
'[{"input": {"n": 2}, "output": 2}, {"input": {"n": 3}, "output": 3}, {"input": {"n": 5}, "output": 8}]'::jsonb,
'{"javascript": "function climbStairs(n) {\n  // Your code here\n}", "python": "def climbStairs(n):\n    # Your code here\n    pass", "java": "class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n    }\n}", "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n    }\n};"}'::jsonb
);