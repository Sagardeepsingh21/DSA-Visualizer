import type { VisualizationResponse } from './generateVisualization';

// Pre-built visualizations for common problems - instant load, no AI needed
export const prebuiltVisualizations: Record<string, VisualizationResponse> = {
  'two-sum': {
    problemCategory: 'Hash Map / Two Pointers',
    simpleExplanation: `Imagine you're at a store with a shopping list that says "spend exactly $9". You have items priced at $2, $7, $11, and $15. You need to find TWO items that cost exactly $9 together.

Instead of checking every pair (slow!), use a smart trick: For each item, calculate what partner price you need, and remember items you've seen. When you see $2, you need $7. Write that down. When you see $7, you already know you need $7 - and you've seen $2! Found it!`,
    coreIdea: 'Use a "memory" (hash map) to remember numbers you\'ve seen. For each number, check if the partner you need is already in memory.',
    stepByStepWalkthrough: [
      'Create an empty "memory" (hash map) to store numbers and their positions',
      'Look at first number (2). Need 9-2=7. Is 7 in memory? No. Save {2: index 0}',
      'Look at second number (7). Need 9-7=2. Is 2 in memory? YES! Found at index 0!',
      'Return the two indices: [0, 1] because nums[0] + nums[1] = 2 + 7 = 9'
    ],
    pseudoCode: `function twoSum(nums, target):
    memory = {}  // Store seen numbers
    
    for i, num in nums:
        partner = target - num
        
        if partner in memory:
            return [memory[partner], i]  // Found!
        
        memory[num] = i  // Remember this number
    
    return []  // No solution`,
    visualization: {
      type: 'hash_map',
      data: [2, 7, 11, 15],
      steps: [
        {
          description: '🎯 Goal: Find two numbers that add up to 9. Start with empty memory.',
          highlight: [],
          pointerPositions: { current: -1 },
          extraInfo: { target: 9, memory: '{}', looking_for: '-' }
        },
        {
          description: '👀 Check 2. Need partner = 9-2 = 7. Not in memory yet. Remember 2.',
          highlight: [0],
          pointerPositions: { current: 0 },
          extraInfo: { target: 9, memory: '{2: 0}', looking_for: 7 }
        },
        {
          description: '✅ Check 7. Need partner = 9-7 = 2. Found 2 in memory at index 0! Done!',
          highlight: [0, 1],
          pointerPositions: { current: 1 },
          extraInfo: { target: 9, memory: '{2: 0}', found: '2+7=9' }
        }
      ]
    }
  },
  
  'valid-parentheses': {
    problemCategory: 'Stack',
    simpleExplanation: `Think of it like matching socks from laundry! When you see an opening bracket ( [ {, put its matching closing bracket ) ] } on a pile. When you see a closing bracket, check if it matches the top of your pile. If yes, remove it. If no or pile is empty when you see a closing bracket - invalid!`,
    coreIdea: 'Use a stack to track expected closing brackets. Each opening bracket pushes its partner. Each closing bracket must match what\'s on top.',
    stepByStepWalkthrough: [
      'See "(" → push its partner ")" onto stack',
      'See "[" → push its partner "]" onto stack', 
      'See "]" → pop stack, check if it matches "]" → Yes!',
      'See ")" → pop stack, check if it matches ")" → Yes!',
      'Stack empty at end → Valid!'
    ],
    pseudoCode: `function isValid(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:  // Opening bracket
            stack.push(pairs[char])
        else:  // Closing bracket
            if stack.empty() or stack.pop() != char:
                return false
    
    return stack.empty()`,
    visualization: {
      type: 'stack',
      data: [')', ']'],
      steps: [
        {
          description: '📚 Input: "([])". Start with empty stack.',
          highlight: [],
          extraInfo: { input: '([])', position: 'start', stackSize: 0 }
        },
        {
          description: '🔵 See "(". Push its partner ")" to stack.',
          highlight: [0],
          extraInfo: { input: '([])', char: '(', action: 'push )', stackSize: 1 }
        },
        {
          description: '🟢 See "[". Push its partner "]" to stack.',
          highlight: [0, 1],
          extraInfo: { input: '([])', char: '[', action: 'push ]', stackSize: 2 }
        },
        {
          description: '✅ See "]". Pop stack → "]". Match! Remove it.',
          highlight: [0],
          extraInfo: { input: '([])', char: ']', action: 'pop & match', stackSize: 1 }
        },
        {
          description: '✅ See ")". Pop stack → ")". Match! Remove it.',
          highlight: [],
          extraInfo: { input: '([])', char: ')', action: 'pop & match', stackSize: 0 }
        },
        {
          description: '🎉 Stack empty! All brackets matched. Valid!',
          highlight: [],
          extraInfo: { result: 'VALID ✓', stackSize: 0 }
        }
      ]
    }
  },

  'best-time-to-buy-and-sell-stock': {
    problemCategory: 'Sliding Window / Greedy',
    simpleExplanation: `Imagine you have a time machine but can only use it once! You see stock prices for each day. You want to buy low, sell high. Track the MINIMUM price you've seen so far, and at each day calculate "if I sell today, what's my profit?" Keep the best profit.`,
    coreIdea: 'Track minimum price seen so far. At each price, calculate potential profit. Keep maximum profit found.',
    stepByStepWalkthrough: [
      'Day 1: Price $7. Min so far = $7. Can\'t sell yet.',
      'Day 2: Price $1. New minimum! Min = $1.',
      'Day 3: Price $5. Profit if sell = $5-$1 = $4. Best so far!',
      'Day 4: Price $3. Profit = $3-$1 = $2. Keep $4.',
      'Day 5: Price $6. Profit = $6-$1 = $5. New best!',
      'Day 6: Price $4. Profit = $4-$1 = $3. Keep $5.',
      'Answer: Maximum profit = $5 (buy at $1, sell at $6)'
    ],
    pseudoCode: `function maxProfit(prices):
    minPrice = infinity
    maxProfit = 0
    
    for price in prices:
        minPrice = min(minPrice, price)
        profit = price - minPrice
        maxProfit = max(maxProfit, profit)
    
    return maxProfit`,
    visualization: {
      type: 'stock_chart',
      data: [7, 1, 5, 3, 6, 4],
      steps: [
        {
          description: '📈 Prices: [7,1,5,3,6,4]. Find best buy/sell days.',
          highlight: [],
          pointerPositions: { current: -1 },
          extraInfo: { minPrice: '∞', maxProfit: 0 }
        },
        {
          description: '💰 Day 1: $7. First price = new minimum.',
          highlight: [0],
          pointerPositions: { current: 0, minDay: 0 },
          extraInfo: { minPrice: 7, maxProfit: 0, action: 'Set min' }
        },
        {
          description: '🔻 Day 2: $1. New minimum! Best day to buy.',
          highlight: [1],
          pointerPositions: { current: 1, minDay: 1 },
          extraInfo: { minPrice: 1, maxProfit: 0, action: 'New min!' }
        },
        {
          description: '📊 Day 3: $5. Profit = $5-$1 = $4. Best so far!',
          highlight: [1, 2],
          pointerPositions: { current: 2, minDay: 1 },
          extraInfo: { minPrice: 1, maxProfit: 4, profit: '5-1=4' }
        },
        {
          description: '📊 Day 4: $3. Profit = $3-$1 = $2. Keep $4.',
          highlight: [1, 3],
          pointerPositions: { current: 3, minDay: 1 },
          extraInfo: { minPrice: 1, maxProfit: 4, profit: '3-1=2' }
        },
        {
          description: '🎯 Day 5: $6. Profit = $6-$1 = $5. NEW BEST!',
          highlight: [1, 4],
          pointerPositions: { current: 4, minDay: 1, sellDay: 4 },
          extraInfo: { minPrice: 1, maxProfit: 5, profit: '6-1=5' }
        },
        {
          description: '📊 Day 6: $4. Profit = $4-$1 = $3. Keep $5.',
          highlight: [1, 5],
          pointerPositions: { current: 5, minDay: 1, sellDay: 4 },
          extraInfo: { minPrice: 1, maxProfit: 5, profit: '4-1=3' }
        },
        {
          description: '✅ Result: Buy day 2 ($1), Sell day 5 ($6). Profit = $5',
          highlight: [1, 4],
          pointerPositions: { minDay: 1, sellDay: 4 },
          extraInfo: { result: 'Buy@$1, Sell@$6', maxProfit: 5 }
        }
      ]
    }
  },

  'maximum-subarray': {
    problemCategory: 'Dynamic Programming / Kadane\'s Algorithm',
    simpleExplanation: `Imagine collecting coins on a path. Some coins are positive (gain money), some negative (lose money). You want to find the best stretch of path. The trick: if your total becomes negative, START FRESH! A negative sum only drags you down.`,
    coreIdea: 'Track current sum. If it goes negative, reset to 0 (start fresh). Always track the maximum sum seen.',
    stepByStepWalkthrough: [
      'Start: currentSum = 0, maxSum = -∞',
      'Add -2: currentSum = -2 (negative, reset to 0)',
      'Add 1: currentSum = 1, maxSum = 1',
      'Add -3: currentSum = -2 (negative, reset to 0)',
      'Add 4: currentSum = 4, maxSum = 4',
      'Add -1: currentSum = 3',
      'Add 2: currentSum = 5, maxSum = 5',
      'Add 1: currentSum = 6, maxSum = 6 ← ANSWER!',
      'Add -5: currentSum = 1',
      'Add 4: currentSum = 5'
    ],
    pseudoCode: `function maxSubArray(nums):
    currentSum = 0
    maxSum = nums[0]
    
    for num in nums:
        currentSum = max(num, currentSum + num)
        maxSum = max(maxSum, currentSum)
    
    return maxSum`,
    visualization: {
      type: 'subarray',
      data: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      steps: [
        {
          description: '🎯 Find contiguous subarray with largest sum.',
          highlight: [],
          pointerPositions: {},
          extraInfo: { currentSum: 0, maxSum: '-∞' }
        },
        {
          description: '➕ Add -2. Sum = -2. Negative! Reset to 0.',
          highlight: [0],
          pointerPositions: { current: 0 },
          extraInfo: { currentSum: 0, maxSum: -2, action: 'Reset' }
        },
        {
          description: '➕ Add 1. Sum = 1. New max!',
          highlight: [1],
          pointerPositions: { current: 1, start: 1 },
          extraInfo: { currentSum: 1, maxSum: 1 }
        },
        {
          description: '➕ Add -3. Sum = -2. Negative! Reset.',
          highlight: [2],
          pointerPositions: { current: 2 },
          extraInfo: { currentSum: 0, maxSum: 1, action: 'Reset' }
        },
        {
          description: '➕ Add 4. Sum = 4. New max!',
          highlight: [3],
          pointerPositions: { current: 3, start: 3 },
          extraInfo: { currentSum: 4, maxSum: 4 }
        },
        {
          description: '➕ Add -1. Sum = 3. Continue (still positive).',
          highlight: [3, 4],
          pointerPositions: { current: 4, start: 3 },
          extraInfo: { currentSum: 3, maxSum: 4 }
        },
        {
          description: '➕ Add 2. Sum = 5. New max!',
          highlight: [3, 4, 5],
          pointerPositions: { current: 5, start: 3 },
          extraInfo: { currentSum: 5, maxSum: 5 }
        },
        {
          description: '➕ Add 1. Sum = 6. NEW MAX! 🎉',
          highlight: [3, 4, 5, 6],
          pointerPositions: { current: 6, start: 3, end: 6 },
          extraInfo: { currentSum: 6, maxSum: 6 }
        },
        {
          description: '✅ Best subarray: [4,-1,2,1] = 6',
          highlight: [3, 4, 5, 6],
          pointerPositions: { start: 3, end: 6 },
          extraInfo: { result: '[4,-1,2,1]', maxSum: 6 }
        }
      ]
    }
  },

  'climbing-stairs': {
    problemCategory: 'Dynamic Programming',
    simpleExplanation: `You're climbing stairs and can take 1 or 2 steps at a time. How many different ways to reach the top? It's like Fibonacci! Ways to reach step N = ways to reach (N-1) + ways to reach (N-2). Because you can arrive from 1 step below OR 2 steps below.`,
    coreIdea: 'This is Fibonacci! dp[n] = dp[n-1] + dp[n-2]. You can reach any step from the previous step (1 jump) or from two steps back (2 jumps).',
    stepByStepWalkthrough: [
      'Step 1: Only 1 way (one single step)',
      'Step 2: 2 ways (1+1 or 2)',
      'Step 3: 3 ways = ways(2) + ways(1) = 2+1',
      'Step 4: 5 ways = ways(3) + ways(2) = 3+2',
      'Step 5: 8 ways = ways(4) + ways(3) = 5+3'
    ],
    pseudoCode: `function climbStairs(n):
    if n <= 2: return n
    
    prev2, prev1 = 1, 2
    for i from 3 to n:
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1`,
    visualization: {
      type: 'stairs',
      data: [1, 2, 3, 5, 8],
      steps: [
        {
          description: '🪜 Climb 5 stairs. Can take 1 or 2 steps each time.',
          highlight: [],
          extraInfo: { step: 0, ways: '?' }
        },
        {
          description: '1️⃣ Step 1: Only 1 way to get here.',
          highlight: [0],
          extraInfo: { step: 1, ways: 1, paths: '[1]' }
        },
        {
          description: '2️⃣ Step 2: 2 ways (1+1) or (2).',
          highlight: [0, 1],
          extraInfo: { step: 2, ways: 2, paths: '[1,1] or [2]' }
        },
        {
          description: '3️⃣ Step 3: ways(2) + ways(1) = 2+1 = 3.',
          highlight: [0, 1, 2],
          extraInfo: { step: 3, ways: 3, formula: '2+1' }
        },
        {
          description: '4️⃣ Step 4: ways(3) + ways(2) = 3+2 = 5.',
          highlight: [0, 1, 2, 3],
          extraInfo: { step: 4, ways: 5, formula: '3+2' }
        },
        {
          description: '5️⃣ Step 5: ways(4) + ways(3) = 5+3 = 8. ✅',
          highlight: [0, 1, 2, 3, 4],
          extraInfo: { step: 5, ways: 8, formula: '5+3' }
        }
      ]
    }
  }
};

export const getPrebuiltVisualization = (problemId: string): VisualizationResponse | null => {
  return prebuiltVisualizations[problemId] || null;
};
