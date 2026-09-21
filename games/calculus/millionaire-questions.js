(function(root){
'use strict';
const bank={
  "highSchool": {
    "key": "highSchool",
    "label": "High school",
    "description": "Swedish Matematik 3 calculus concepts",
    "levels": [
      [
        {
          "id": "h06",
          "q": "In y = f(x), which variable is normally treated as the input?",
          "a": [
            "y",
            "f",
            "x",
            "the slope"
          ],
          "correct": 2,
          "why": "The independent variable x is the input, and the function uses it to produce the output y.",
          "topic": "function-language"
        },
        {
          "id": "h43",
          "q": "In the line y = kx + m, what does k represent?",
          "a": [
            "The slope of the line",
            "The y-intercept",
            "The x-intercept",
            "The length of the line"
          ],
          "correct": 0,
          "why": "The coefficient k gives the change in y for each one-unit increase in x, so it is the slope.",
          "topic": "linear-functions"
        },
        {
          "id": "h47",
          "q": "Two non-vertical lines are parallel. What must be true of their equations y = kx + m?",
          "a": [
            "They have the same value of k",
            "They have the same value of m",
            "Both values of m are zero",
            "Their slopes multiply to −1"
          ],
          "correct": 0,
          "why": "Parallel non-vertical lines have equal slopes, while their y-intercepts may be different.",
          "topic": "parallel-lines"
        },
        {
          "id": "h48",
          "q": "When is the cosine rule especially useful for finding a side of a triangle?",
          "a": [
            "When two sides and the included angle are known",
            "Only for right triangles",
            "When all angles but no side are known",
            "Only when two sides are equal"
          ],
          "correct": 0,
          "why": "The cosine rule directly relates the unknown side to two known sides and the angle between them.",
          "topic": "cosine-rule"
        },
        {
          "id": "h57",
          "q": "In the line y = kx + m, what does m represent?",
          "a": [
            "The y-intercept",
            "The slope",
            "The x-intercept",
            "The domain"
          ],
          "correct": 0,
          "why": "Setting x=0 gives y=m, so m is the height where the line crosses the y-axis.",
          "topic": "linear-functions"
        },
        {
          "id": "h58",
          "q": "For two non-vertical perpendicular lines, how are their slopes related?",
          "a": [
            "Their product is −1",
            "Their slopes are equal",
            "Their sum is always zero",
            "Both slopes must be positive"
          ],
          "correct": 0,
          "why": "Perpendicular non-vertical lines have negative reciprocal slopes, so their product is −1.",
          "topic": "perpendicular-lines"
        },
        {
          "id": "h60",
          "q": "A side and its opposite angle are known in a triangle. If another angle is known and its opposite side is sought, which rule applies directly?",
          "a": [
            "The sine rule",
            "The cosine rule",
            "Pythagoras’ theorem only",
            "The midpoint formula"
          ],
          "correct": 0,
          "why": "The sine rule relates two matching side–opposite-angle pairs, so the known pair and second angle determine the sought opposite side.",
          "topic": "sine-rule"
        },
        {
          "id": "h62",
          "q": "For x²+px+q=0, the pq formula is x=−p/2 ± √((p/2)²−q). Which expression is the discriminant?",
          "a": [
            "(p/2)²−q",
            "−p/2",
            "p²−q",
            "(p/2)²+q"
          ],
          "correct": 0,
          "why": "In the pq formula, the expression under the square root is the discriminant. Its sign determines the number of real solutions.",
          "topic": "quadratics"
        }
      ],
      [
        {
          "id": "h63",
          "q": "Why is completing the square useful for a quadratic function?",
          "a": [
            "It reveals the vertex form of the parabola",
            "It turns every quadratic into a line",
            "It removes the leading coefficient",
            "It gives the derivative directly"
          ],
          "correct": 0,
          "why": "Completed-square form makes the parabola’s turning point and horizontal shift visible.",
          "topic": "quadratics"
        },
        {
          "id": "h64",
          "q": "Which formula gives the area of a triangle using two sides a and b and their included angle C?",
          "a": [
            "ab sin(C)/2",
            "ab cos(C)",
            "a+b+C",
            "a²+b²"
          ],
          "correct": 0,
          "why": "The perpendicular height relative to one side is the other side multiplied by sin(C), giving area ab sin(C)/2.",
          "topic": "triangle-area"
        },
        {
          "id": "h68",
          "q": "If two similar figures have length scale factor 3, what is their area scale factor?",
          "a": [
            "9",
            "3",
            "6",
            "27"
          ],
          "correct": 0,
          "why": "Areas scale with the square of the length factor, so a length factor of 3 gives an area factor of 3²=9.",
          "topic": "similarity"
        },
        {
          "id": "h69",
          "q": "A quadratic function opens downward. What kind of extremum does its vertex have?",
          "a": [
            "An absolute maximum",
            "An absolute minimum",
            "No extremum",
            "A vertical asymptote"
          ],
          "correct": 0,
          "why": "Every other point on a downward-opening parabola lies below its vertex, so the vertex is the absolute maximum.",
          "topic": "quadratics"
        },
        {
          "id": "h81",
          "q": "How many radians are in half a circle?",
          "a": [
            "π",
            "2π",
            "π/2",
            "1"
          ],
          "correct": 0,
          "why": "A complete circle corresponds to 2π radians, so half a circle corresponds to π radians.",
          "topic": "radians"
        },
        {
          "id": "h84",
          "q": "On the unit circle, what does cos(θ) represent?",
          "a": [
            "The x-coordinate of the point",
            "The y-coordinate of the point",
            "The arc length only",
            "The slope of the radius"
          ],
          "correct": 0,
          "why": "A point at angle θ on the unit circle has coordinates (cos(θ), sin(θ)).",
          "topic": "unit-circle"
        },
        {
          "id": "h87",
          "q": "In a right triangle, what does tan(θ)·cos(θ) represent?",
          "a": [
            "Opposite side divided by adjacent side",
            "Adjacent side divided by hypotenuse",
            "Opposite side divided by hypotenuse",
            "Hypotenuse divided by opposite side"
          ],
          "correct": 2,
          "why": "Tangent is opposite divided by adjacent, while cosine is adjacent divided by hypotenuse. Multiplying cancels the adjacent side, leaving opposite divided by hypotenuse.",
          "topic": "trigonometric-ratios"
        },
        {
          "id": "h88",
          "q": "If a line has equation y=m, what does its graph look like?",
          "a": [
            "A horizontal line",
            "A vertical line",
            "A parabola",
            "A line through the origin with slope m"
          ],
          "correct": 0,
          "why": "The y-value is the same for every x, so the graph is horizontal.",
          "topic": "linear-functions"
        }
      ],
      [
        {
          "id": "h93",
          "q": "For x²+px+q=0, the pq formula contains the discriminant (p/2)²−q. What happens when this expression equals zero?",
          "a": [
            "The equation has one repeated real solution",
            "The equation has two different real solutions",
            "The equation has no real solutions",
            "Every real number is a solution"
          ],
          "correct": 0,
          "why": "When the expression under the square root is zero, the plus and minus cases give the same real solution x=−p/2.",
          "topic": "quadratics"
        },
        {
          "id": "h96",
          "q": "In a triangle, which side is paired with angle A in the sine rule?",
          "a": [
            "The side opposite A",
            "The side adjacent to A on the left",
            "The longest side in every triangle",
            "The side opposite the smallest angle only"
          ],
          "correct": 0,
          "why": "The sine rule pairs each angle with the side directly opposite it.",
          "topic": "sine-rule"
        },
        {
          "id": "h01",
          "q": "What does f′(a) describe?",
          "a": [
            "The instantaneous rate of change of f at x = a",
            "The average value of f up to x = a",
            "The largest value of f",
            "The area below f from 0 to a"
          ],
          "correct": 0,
          "why": "A derivative at a point is the function’s instantaneous rate of change there; geometrically, it is the slope of the tangent line.",
          "topic": "derivative-meaning"
        },
        {
          "id": "h02",
          "q": "A graph has time on the horizontal axis and total distance travelled on the vertical axis. What does its slope represent?",
          "a": [
            "Distance remaining",
            "Speed",
            "Velocity",
            "Acceleration"
          ],
          "correct": 1,
          "why": "The slope measures the change in total distance divided by the change in time, so it represents speed. A position–time graph, by contrast, has velocity as its slope.",
          "topic": "motion"
        },
        {
          "id": "h03",
          "q": "Which notation means “the limit of f(x) as x approaches 3”?",
          "a": [
            "f′(3)",
            "∫ f(x) dx",
            "limₓ→₃ f(x)",
            "f(3)²"
          ],
          "correct": 2,
          "why": "The expression limₓ→₃ f(x) asks what value f(x) approaches when x gets close to 3.",
          "topic": "limit-meaning"
        },
        {
          "id": "h04",
          "q": "What is the main difference between average and instantaneous rate of change?",
          "a": [
            "Average uses an interval; instantaneous refers to one moment",
            "Only average rate can be negative",
            "Instantaneous rate never uses a derivative",
            "They always have the same value"
          ],
          "correct": 0,
          "why": "Average rate compares two points across an interval, while instantaneous rate is the limiting rate at one point.",
          "topic": "rates"
        },
        {
          "id": "h05",
          "q": "Geometrically, an average rate of change is represented by the slope of…",
          "a": [
            "a tangent line",
            "a secant line through two graph points",
            "the y-axis",
            "a vertical asymptote"
          ],
          "correct": 1,
          "why": "A secant line joins two points on the graph, so its slope measures change across the interval between them.",
          "topic": "secants"
        },
        {
          "id": "h07",
          "q": "Which expression represents the derivative of f as a new function?",
          "a": [
            "f(x + 1)",
            "f′(x)",
            "lim f(x)",
            "∫₀ˣ f(t)dt"
          ],
          "correct": 1,
          "why": "The notation f′(x) names the derivative function, which assigns an instantaneous rate of change to each suitable x.",
          "topic": "derivative-notation"
        }
      ],
      [
        {
          "id": "h08",
          "q": "When x approaches a in a limit, must x actually equal a?",
          "a": [
            "Yes, always",
            "Only if f is linear",
            "No; a limit concerns values arbitrarily close to a",
            "Only for one-sided limits"
          ],
          "correct": 2,
          "why": "A limit studies nearby behavior. The input may approach a without ever taking the value a itself.",
          "topic": "limit-meaning"
        },
        {
          "id": "h13",
          "q": "If distance is measured in metres and time in seconds, what units does its derivative have?",
          "a": [
            "metres",
            "seconds",
            "metres per second",
            "square metres"
          ],
          "correct": 2,
          "why": "A derivative carries output units divided by input units, giving metres per second in this situation.",
          "topic": "units"
        },
        {
          "id": "h16",
          "q": "For a position function s(t), what does s′(t) represent?",
          "a": [
            "Position again",
            "Velocity",
            "Acceleration",
            "Total distance in every case"
          ],
          "correct": 1,
          "why": "The instantaneous rate of change of position with respect to time is velocity.",
          "topic": "motion"
        },
        {
          "id": "h38",
          "q": "For a position function, the second derivative with respect to time represents…",
          "a": [
            "distance",
            "velocity",
            "acceleration",
            "average position"
          ],
          "correct": 2,
          "why": "The first derivative of position is velocity, and differentiating velocity gives acceleration.",
          "topic": "motion"
        },
        {
          "id": "h42",
          "q": "For an exponential function f(x)=aˣ with a>1, which description is correct?",
          "a": [
            "It is increasing and stays positive",
            "It is decreasing and stays negative",
            "It has a vertical asymptote at x=0",
            "It reaches an absolute maximum"
          ],
          "correct": 0,
          "why": "An exponential with base greater than one grows as x increases and its values are always positive.",
          "topic": "exponential-functions"
        },
        {
          "id": "h44",
          "q": "For a>0 and b>0, which logarithm law correctly rewrites log(ab)?",
          "a": [
            "log(a)+log(b)",
            "log(a)log(b)",
            "log(a+b)",
            "log(a)−log(b)"
          ],
          "correct": 0,
          "why": "The logarithm of a product equals the sum of the logarithms of its positive factors.",
          "topic": "logarithms"
        },
        {
          "id": "h55",
          "q": "If f is a rate measured in litres per minute, what units does ∫ₐᵇ f(t)dt have?",
          "a": [
            "Litres per minute",
            "Minutes per litre",
            "Litres",
            "Square litres"
          ],
          "correct": 2,
          "why": "Integrating a rate over time accumulates the underlying quantity, so the result is measured in litres.",
          "topic": "units"
        },
        {
          "id": "h80",
          "q": "If velocity is positive while acceleration is negative, which statement is correct?",
          "a": [
            "The object moves forward while slowing down",
            "The object moves backward while speeding up",
            "The object is stationary",
            "Its position must be negative"
          ],
          "correct": 0,
          "why": "Positive velocity gives the direction of motion, while acceleration of the opposite sign reduces the speed.",
          "topic": "motion"
        }
      ],
      [
        {
          "id": "h09",
          "q": "If f′(x) is positive throughout an interval, what must f do there?",
          "a": [
            "Decrease",
            "Stay constant",
            "Increase",
            "Cross the x-axis"
          ],
          "correct": 2,
          "why": "A positive derivative means the function has positive slope, so it increases across that interval.",
          "topic": "monotonicity"
        },
        {
          "id": "h10",
          "q": "If f′(x) = 0 throughout an interval, which description fits f?",
          "a": [
            "It is constant there",
            "It is always positive there",
            "It has a vertical tangent there",
            "It is concave up there"
          ],
          "correct": 0,
          "why": "Zero derivative throughout an interval means zero slope everywhere in that interval, so the function is constant.",
          "topic": "derivative-zero"
        },
        {
          "id": "h11",
          "q": "A tangent line is best described as a line that…",
          "a": [
            "always crosses the graph twice",
            "has the same local direction as the curve at a point",
            "is always horizontal",
            "never meets the curve again"
          ],
          "correct": 1,
          "why": "A tangent line matches the curve’s instantaneous direction at the point of tangency.",
          "topic": "tangent-geometry"
        },
        {
          "id": "h12",
          "q": "If f′(x) is negative across an interval, what is f doing there?",
          "a": [
            "Increasing",
            "Decreasing",
            "Remaining constant",
            "Alternating direction at every point"
          ],
          "correct": 1,
          "why": "A negative derivative means the graph has negative slope throughout the interval, so its values decrease.",
          "topic": "monotonicity"
        },
        {
          "id": "h14",
          "q": "What does a horizontal tangent tell you at that point?",
          "a": [
            "The derivative is zero",
            "The function is zero",
            "The second derivative is zero",
            "The function is discontinuous"
          ],
          "correct": 0,
          "why": "A horizontal line has slope zero, so the derivative at a smooth point with a horizontal tangent is zero.",
          "topic": "stationary-points"
        },
        {
          "id": "h15",
          "q": "If g(x) = 5f(x) + 3, how do the slopes of g compare with those of f?",
          "a": [
            "They are three units larger",
            "They are five times as large",
            "They are eight times as large",
            "They are unchanged"
          ],
          "correct": 1,
          "why": "Multiplying f by five multiplies every slope by five. Adding three shifts the graph vertically but does not change its slopes.",
          "topic": "derivative-rules"
        },
        {
          "id": "h24",
          "q": "A graph has a horizontal tangent but keeps increasing on both sides. What can be concluded from this information alone?",
          "a": [
            "It is a local maximum",
            "It is a local minimum",
            "It is a stationary point with no local extremum",
            "It is an inflection point"
          ],
          "correct": 2,
          "why": "The derivative is zero but the function keeps increasing, so there is no local maximum or minimum. A concavity change would be needed to call it an inflection point.",
          "topic": "stationary-points"
        },
        {
          "id": "h40",
          "q": "Near a concave-up curve, where does a tangent line usually lie?",
          "a": [
            "Above the curve",
            "Below the curve",
            "Always on the x-axis",
            "Always vertically through it"
          ],
          "correct": 1,
          "why": "For a differentiable concave-up function, the graph bends above its tangent lines locally.",
          "topic": "tangent-geometry"
        }
      ],
      [
        {
          "id": "h45",
          "q": "Why can logarithmic differentiation be useful for a complicated product?",
          "a": [
            "It turns products into sums before differentiating",
            "It makes every derivative equal one",
            "It removes the domain restrictions",
            "It converts the product into an integral"
          ],
          "correct": 0,
          "why": "Logarithm laws turn products and powers into sums and coefficients, which are usually easier to differentiate.",
          "topic": "derivative-rules"
        },
        {
          "id": "h66",
          "q": "A differentiable function has f′(x)>0 everywhere on an interval. Which conclusion is strongest?",
          "a": [
            "It has no absolute maximum on any interval",
            "It is one-to-one on that interval",
            "It is concave up",
            "Its range is all real numbers"
          ],
          "correct": 1,
          "why": "A positive derivative makes the function strictly increasing across the interval, so it cannot take the same output at two different inputs there.",
          "topic": "monotonicity"
        },
        {
          "id": "h17",
          "q": "If f is continuous at c and f′ changes from positive to negative there, what does the first derivative test establish?",
          "a": [
            "A local maximum at c",
            "A local minimum at c",
            "A vertical asymptote at c",
            "No local extremum at c"
          ],
          "correct": 0,
          "why": "The function increases before c and decreases after c, so c is a local maximum.",
          "topic": "first-derivative-test"
        },
        {
          "id": "h18",
          "q": "What is a critical point of f?",
          "a": [
            "A point (c,f(c)) where f′(c)=0 or f′(c) does not exist",
            "Any point where f(c)=0",
            "A point where f″(c)>0",
            "Only the highest point on the graph"
          ],
          "correct": 0,
          "why": "A critical point lies on the graph at an input in the domain where the derivative is zero or does not exist.",
          "topic": "critical-points"
        },
        {
          "id": "h19",
          "q": "If f is continuous at c and f′ changes from negative to positive there, what does the first derivative test establish?",
          "a": [
            "A local maximum at c",
            "A local minimum at c",
            "A vertical asymptote at c",
            "No local extremum at c"
          ],
          "correct": 1,
          "why": "The function decreases before c and increases after c, so c is a local minimum.",
          "topic": "first-derivative-test"
        },
        {
          "id": "h20",
          "q": "Does f′(c) = 0 by itself guarantee a local maximum or minimum at c?",
          "a": [
            "Yes, always",
            "Only a maximum",
            "No; the graph might continue in the same direction",
            "Only when f(c)=0"
          ],
          "correct": 2,
          "why": "A zero derivative only makes c a candidate. A stationary inflection point can have f′(c)=0 without being an extremum.",
          "topic": "critical-points"
        },
        {
          "id": "h21",
          "q": "What is the purpose of the first derivative test?",
          "a": [
            "To find the area under a graph",
            "To classify critical points using changes in the sign of f′",
            "To prove continuity",
            "To locate vertical asymptotes only"
          ],
          "correct": 1,
          "why": "The test checks whether f changes between increasing and decreasing on the two sides of a critical point.",
          "topic": "first-derivative-test"
        },
        {
          "id": "h22",
          "q": "Which description distinguishes an absolute maximum from a local maximum?",
          "a": [
            "An absolute maximum is greatest on the whole domain or interval",
            "An absolute maximum must occur at zero",
            "A local maximum is never a critical point",
            "There is no difference"
          ],
          "correct": 0,
          "why": "A local maximum only beats nearby values; an absolute maximum is at least as large as every allowed value.",
          "topic": "absolute-extrema"
        }
      ],
      [
        {
          "id": "h23",
          "q": "Why can an endpoint be an absolute extremum without having derivative zero?",
          "a": [
            "An endpoint has only one side inside the interval",
            "Endpoints are never part of the interval",
            "All endpoint derivatives are infinite",
            "The function must be discontinuous"
          ],
          "correct": 0,
          "why": "The usual derivative condition applies to interior extrema. At an endpoint, values can only be compared from the side that lies inside the interval.",
          "topic": "endpoints"
        },
        {
          "id": "h91",
          "q": "A continuous function has a local maximum at an interior critical point of [a,b]. Could an endpoint still be the absolute maximum?",
          "a": [
            "No, a local maximum is always absolute",
            "Yes; the endpoint values must still be compared",
            "Only if the function is discontinuous",
            "Only when the critical point has value zero"
          ],
          "correct": 1,
          "why": "A local maximum only compares nearby values. Without further global information, an endpoint can have a larger value.",
          "topic": "absolute-extrema"
        },
        {
          "id": "h95",
          "q": "If f is continuous at c and f′ changes from negative to positive there, what follows?",
          "a": [
            "f has a local minimum at c",
            "f has a local maximum at c",
            "f must have an inflection point at c",
            "f must equal zero at c"
          ],
          "correct": 0,
          "why": "The sign change shows that f decreases before c and increases after c, so the first derivative test gives a local minimum.",
          "topic": "first-derivative-test"
        },
        {
          "id": "h25",
          "q": "Which statement about differentiability and continuity is correct?",
          "a": [
            "Every continuous function is differentiable",
            "Every differentiable function is continuous",
            "The two ideas are unrelated",
            "A discontinuous function can always be differentiated"
          ],
          "correct": 1,
          "why": "Differentiability guarantees continuity. The reverse is false: a continuous graph can have a sharp corner.",
          "topic": "differentiability"
        },
        {
          "id": "h26",
          "q": "Why is |x| not differentiable at x = 0?",
          "a": [
            "It is discontinuous there",
            "Its value is zero there",
            "The left and right slopes disagree",
            "It has a horizontal tangent"
          ],
          "correct": 2,
          "why": "The slope approaching from the left is −1 and from the right is 1, so there is no single derivative at 0.",
          "topic": "differentiability"
        },
        {
          "id": "h27",
          "q": "If limₓ→a f(x) exists, what must be true?",
          "a": [
            "f(a) must exist",
            "f(a) must equal the limit",
            "The left- and right-hand limits agree",
            "f must be differentiable at a"
          ],
          "correct": 2,
          "why": "A two-sided limit exists precisely when the left- and right-hand limits exist and have the same value.",
          "topic": "one-sided-limits"
        },
        {
          "id": "h28",
          "q": "For f to be continuous at x = a, which relationship is required?",
          "a": [
            "f′(a)=0",
            "limₓ→a f(x)=f(a)",
            "f(a)>0",
            "the left-hand limit must be zero"
          ],
          "correct": 1,
          "why": "Continuity at a requires the function value to exist, the limit to exist, and those two values to be equal.",
          "topic": "continuity"
        },
        {
          "id": "h29",
          "q": "A graph has a hole at x = a but approaches the same height from both sides. What can be true?",
          "a": [
            "The two-sided limit exists even though the function is not continuous",
            "The two-sided limit cannot exist",
            "The function must be differentiable",
            "The limit must be infinite"
          ],
          "correct": 0,
          "why": "A missing or misplaced function value does not prevent the surrounding graph from approaching one common limit.",
          "topic": "removable-discontinuity"
        }
      ],
      [
        {
          "id": "h30",
          "q": "At a jump discontinuity, why does the two-sided limit fail to exist?",
          "a": [
            "The function is bounded",
            "The left- and right-hand limits are different",
            "The graph has a tangent",
            "The function value is positive"
          ],
          "correct": 1,
          "why": "The two directions approach different heights, so there is no single value for the two-sided limit.",
          "topic": "one-sided-limits"
        },
        {
          "id": "h31",
          "q": "Which feature can make a continuous graph non-differentiable?",
          "a": [
            "A smooth turning point",
            "A sharp corner",
            "A positive y-value",
            "Crossing the x-axis"
          ],
          "correct": 1,
          "why": "A sharp corner can be continuous while having incompatible slopes from the left and right.",
          "topic": "differentiability"
        },
        {
          "id": "h32",
          "q": "How can a removable discontinuity usually be repaired?",
          "a": [
            "By changing the function value at the hole to equal the limit",
            "By differentiating twice",
            "By deleting the entire interval",
            "By adding a vertical asymptote"
          ],
          "correct": 0,
          "why": "Defining the missing value to be the existing limit makes the value and nearby behavior agree.",
          "topic": "removable-discontinuity"
        },
        {
          "id": "h33",
          "q": "If f″(x)>0 throughout an interval, how is the graph of f bending there?",
          "a": [
            "Concave down",
            "Concave up",
            "It must be decreasing",
            "It must cross the x-axis"
          ],
          "correct": 1,
          "why": "A positive second derivative throughout the interval means the slopes are increasing there, so the graph is concave up.",
          "topic": "concavity"
        },
        {
          "id": "h34",
          "q": "Which change identifies an inflection point?",
          "a": [
            "f changes sign",
            "f′ becomes zero",
            "The concavity changes",
            "The graph reaches an endpoint"
          ],
          "correct": 2,
          "why": "An inflection point is where the graph changes concavity, provided the function is continuous there.",
          "topic": "inflection-points"
        },
        {
          "id": "h35",
          "q": "If f′(x)<0 and f″(x)>0 throughout an interval, the graph of f is…",
          "a": [
            "increasing and concave up",
            "decreasing and concave up",
            "decreasing and concave down",
            "increasing and concave down"
          ],
          "correct": 1,
          "why": "The negative first derivative makes f decrease throughout the interval; the positive second derivative makes it concave up there.",
          "topic": "graph-shape"
        },
        {
          "id": "h36",
          "q": "If f″(x) < 0 throughout an interval, what is happening to the slopes of f?",
          "a": [
            "They are increasing",
            "They are decreasing",
            "They are all zero",
            "They are all positive"
          ],
          "correct": 1,
          "why": "A negative second derivative means the first derivative is decreasing, so the tangent slopes get smaller.",
          "topic": "concavity"
        },
        {
          "id": "h37",
          "q": "Can a function have f′(x)>0 and f″(x)<0 throughout the same interval?",
          "a": [
            "No, never",
            "Yes; it increases while its positive slopes get smaller",
            "Only if it is discontinuous",
            "Only at one isolated point"
          ],
          "correct": 1,
          "why": "The positive first derivative makes the function increase, while the negative second derivative makes its slopes decrease.",
          "topic": "graph-shape"
        }
      ],
      [
        {
          "id": "h39",
          "q": "Why is f″(c) = 0 not enough by itself to prove an inflection point?",
          "a": [
            "The function must also equal zero",
            "Concavity must actually change across c",
            "The first derivative must not exist",
            "Inflection points only occur at endpoints"
          ],
          "correct": 1,
          "why": "Zero second derivative only identifies a candidate; an inflection point requires a genuine change in concavity.",
          "topic": "inflection-points"
        },
        {
          "id": "h75",
          "q": "If f′ is increasing immediately before c and decreasing immediately after c, what happens to the concavity of f?",
          "a": [
            "It changes from concave down to concave up",
            "It changes from concave up to concave down",
            "f must have a local maximum at c",
            "f must have a local minimum at c"
          ],
          "correct": 1,
          "why": "An increasing derivative means concave up; a decreasing derivative means concave down. The change in f′ describes the bending of f, not necessarily a maximum or minimum of f.",
          "topic": "inflection-points"
        },
        {
          "id": "h78",
          "q": "If f′ is positive and decreasing, how should f be described?",
          "a": [
            "Increasing and concave down",
            "Increasing and concave up",
            "Decreasing and concave down",
            "Decreasing and concave up"
          ],
          "correct": 0,
          "why": "Positive f′ makes f increase, while a decreasing f′ means its slopes shrink and the graph is concave down.",
          "topic": "graph-shape"
        },
        {
          "id": "h79",
          "q": "Suppose f″ changes from negative to positive at c. What change occurs in f?",
          "a": [
            "Concave down to concave up",
            "Increasing to decreasing",
            "Positive to negative",
            "Continuous to discontinuous"
          ],
          "correct": 0,
          "why": "The sign of the second derivative identifies concavity, so this sign change marks a change from concave down to concave up.",
          "topic": "inflection-points"
        },
        {
          "id": "h83",
          "q": "If f′ is increasing on an interval, which statement follows?",
          "a": [
            "f is increasing",
            "f is concave up",
            "f is positive",
            "f has a minimum"
          ],
          "correct": 1,
          "why": "An increasing first derivative means the slopes of f are increasing, which is precisely concave-up behavior.",
          "topic": "concavity"
        },
        {
          "id": "h89",
          "q": "Suppose f′(x)>0 and f″(x)<0 throughout an interval. What are its tangent slopes doing?",
          "a": [
            "They are positive and increasing",
            "They are positive and decreasing",
            "They are negative and increasing",
            "They are negative and decreasing"
          ],
          "correct": 1,
          "why": "The positive first derivative gives positive slopes, while the negative second derivative means those slopes decrease.",
          "topic": "graph-shape"
        },
        {
          "id": "h94",
          "q": "Suppose f′ remains positive while f changes from concave up to concave down. What happens to its slopes?",
          "a": [
            "They first increase and then decrease while remaining positive",
            "They remain constant",
            "They change from negative to positive",
            "They become undefined"
          ],
          "correct": 0,
          "why": "The concavity change reverses whether the slopes grow or shrink, while f′>0 ensures they remain positive.",
          "topic": "graph-shape"
        },
        {
          "id": "h49",
          "q": "What does a definite integral ∫ₐᵇ f(x) dx represent geometrically?",
          "a": [
            "Only the area above the x-axis",
            "The net signed area between the graph and the x-axis",
            "The slope at x = b",
            "The largest value of f"
          ],
          "correct": 1,
          "why": "Regions above the x-axis contribute positively and regions below contribute negatively, producing net signed area.",
          "topic": "signed-area"
        }
      ],
      [
        {
          "id": "h50",
          "q": "If a<b and an integrable function f is negative throughout [a,b], then ∫ₐᵇ f(x) dx is…",
          "a": [
            "positive",
            "negative",
            "always zero",
            "undefined"
          ],
          "correct": 1,
          "why": "Every signed-area contribution lies below the x-axis across an interval of positive length, so the definite integral is negative.",
          "topic": "signed-area"
        },
        {
          "id": "h51",
          "q": "Reversing the bounds of a definite integral has what effect?",
          "a": [
            "No effect",
            "It squares the result",
            "It changes the sign",
            "It makes the integral zero"
          ],
          "correct": 2,
          "why": "Swapping the lower and upper bounds reverses the direction of accumulation, so the new integral is the negative of the original one.",
          "topic": "integral-properties"
        },
        {
          "id": "h52",
          "q": "Can ∫ₐᵇ f(x)dx equal zero even if f is not zero throughout the interval?",
          "a": [
            "No",
            "Yes; positive and negative signed areas can cancel",
            "Only if a=b",
            "Only if f is discontinuous"
          ],
          "correct": 1,
          "why": "A definite integral measures net signed area, so equal positive and negative contributions can cancel.",
          "topic": "signed-area"
        },
        {
          "id": "h53",
          "q": "To obtain total geometric area when a graph crosses the x-axis, what should be done?",
          "a": [
            "Ignore the region below the axis",
            "Use absolute values of the separate signed regions",
            "Reverse every bound",
            "Differentiate the function first"
          ],
          "correct": 1,
          "why": "Geometric area counts every region positively, so the integral must be split at crossings and negative contributions made positive.",
          "topic": "geometric-area"
        },
        {
          "id": "h54",
          "q": "How does splitting an interval at c affect a definite integral from a to b?",
          "a": [
            "The two pieces add to the original integral",
            "The two pieces must cancel",
            "Each piece equals the original",
            "The integral becomes undefined"
          ],
          "correct": 0,
          "why": "Definite integrals are additive across adjacent intervals: the integral from a to c plus c to b equals a to b.",
          "topic": "integral-properties"
        },
        {
          "id": "h56",
          "q": "If f(x) ≥ 0 on [a,b], what relationship holds between net signed area and geometric area?",
          "a": [
            "They are equal",
            "They have opposite signs",
            "The net area is always zero",
            "No comparison is possible"
          ],
          "correct": 0,
          "why": "When the graph never falls below the x-axis, all area contributions are positive, so the two notions agree.",
          "topic": "signed-area"
        },
        {
          "id": "h59",
          "q": "An antiderivative of f is a function F for which…",
          "a": [
            "F(x) = f(x)²",
            "F′(x) = f(x)",
            "F″(x) = 0",
            "F(x) is always positive"
          ],
          "correct": 1,
          "why": "Antidifferentiation reverses differentiation: F is an antiderivative of f exactly when F′ = f.",
          "topic": "antiderivatives"
        },
        {
          "id": "h61",
          "q": "Why do indefinite integrals include “+ C”?",
          "a": [
            "Every function is periodic",
            "Different antiderivatives can differ by a constant",
            "The derivative of C is one",
            "C represents the upper bound"
          ],
          "correct": 1,
          "why": "Differentiation removes constants, so an entire family of functions with different constant terms has the same derivative.",
          "topic": "antiderivatives"
        }
      ],
      [
        {
          "id": "h41",
          "q": "A continuous function on a closed interval [a,b] is guaranteed to have…",
          "a": [
            "exactly one zero",
            "an absolute maximum and an absolute minimum",
            "a derivative everywhere",
            "equal endpoint values"
          ],
          "correct": 1,
          "why": "The Extreme Value Theorem guarantees both absolute extrema for a continuous function on a closed interval.",
          "topic": "extreme-value-theorem"
        },
        {
          "id": "h46",
          "q": "Why does the Extreme Value Theorem require a closed, bounded interval?",
          "a": [
            "Including the endpoints prevents an extreme value from being approached only at an excluded edge",
            "A continuous function on an open interval is always constant",
            "Every endpoint must be a critical point",
            "A bounded interval makes every derivative zero"
          ],
          "correct": 0,
          "why": "Including the endpoints prevents a greatest or least value from being approached only at an excluded endpoint; boundedness also prevents the interval from extending indefinitely.",
          "topic": "extreme-value-theorem"
        },
        {
          "id": "h65",
          "q": "In an optimization problem, why are endpoints checked along with critical points?",
          "a": [
            "Derivatives never work at interior points",
            "An absolute optimum may occur at an endpoint",
            "Endpoints always give the maximum",
            "Critical points cannot be evaluated"
          ],
          "correct": 1,
          "why": "On a closed interval, the absolute maximum or minimum can occur either at a critical point or at an endpoint.",
          "topic": "closed-interval-method"
        },
        {
          "id": "h67",
          "q": "When maximizing the volume of a box made from fixed material, the “constraint” expresses…",
          "a": [
            "the quantity being maximized",
            "the fixed relationship the dimensions must obey",
            "the derivative of volume",
            "the final answer only"
          ],
          "correct": 1,
          "why": "A constraint records the fixed limitation and lets the variables be related before optimizing the objective.",
          "topic": "optimization-modeling"
        },
        {
          "id": "h70",
          "q": "After finding a critical point in a practical optimization problem, what must still be checked?",
          "a": [
            "Whether it lies in the feasible domain and gives the required optimum",
            "Whether its input is always zero",
            "Whether the original units disappear",
            "Whether every endpoint has derivative zero"
          ],
          "correct": 0,
          "why": "An algebraic candidate may be infeasible or may give the wrong kind of extremum, so the domain and competing candidates matter.",
          "topic": "optimization-validation"
        },
        {
          "id": "h71",
          "q": "Why should physical restrictions be included in the domain of an optimization problem?",
          "a": [
            "They prevent impossible candidates such as negative lengths",
            "They force the derivative to be positive",
            "They make every function continuous",
            "They remove all endpoints"
          ],
          "correct": 0,
          "why": "The mathematical model should only admit values meaningful in the original situation, such as positive dimensions and available material.",
          "topic": "optimization-domain"
        },
        {
          "id": "h72",
          "q": "A continuous function on a closed interval has one candidate whose value is smaller than those at every other interior critical point and both endpoints. What is that candidate?",
          "a": [
            "The absolute maximum",
            "The absolute minimum",
            "Necessarily an inflection point",
            "Not an extremum candidate"
          ],
          "correct": 1,
          "why": "For a continuous function on a closed interval, comparing every interior critical point and both endpoints identifies the absolute extrema.",
          "topic": "closed-interval-method"
        },
        {
          "id": "h73",
          "q": "A function has f′(c) = 0 and f″(c) < 0. What does the second derivative test conclude?",
          "a": [
            "A local minimum at c",
            "A local maximum at c",
            "An inflection point at c",
            "No conclusion because f′(c)=0"
          ],
          "correct": 1,
          "why": "The horizontal tangent and negative concavity mean the graph bends downward at c, giving a local maximum.",
          "topic": "second-derivative-test"
        }
      ],
      [
        {
          "id": "h74",
          "q": "Which situation makes the second derivative test inconclusive at a critical point c?",
          "a": [
            "f″(c) > 0",
            "f″(c) < 0",
            "f″(c) = 0",
            "f(c) = 0"
          ],
          "correct": 2,
          "why": "When f″(c)=0, the point might be a maximum, minimum, or neither; another test is needed.",
          "topic": "second-derivative-test"
        },
        {
          "id": "h76",
          "q": "At a critical point c, f″(c)>0. What feature of the graph supports the test’s conclusion?",
          "a": [
            "The graph bends upward around a horizontal tangent",
            "The graph crosses a vertical asymptote",
            "The graph bends downward",
            "The function is undefined"
          ],
          "correct": 0,
          "why": "Positive concavity makes a horizontal tangent sit at the bottom of a local bowl, supporting a local minimum.",
          "topic": "second-derivative-test"
        },
        {
          "id": "h77",
          "q": "Which example shows why f″(c)=0 does not settle the nature of a critical point?",
          "a": [
            "A stationary point may be an extremum or a stationary inflection",
            "Every such point is undefined",
            "The first derivative must be positive",
            "The graph must be linear"
          ],
          "correct": 0,
          "why": "Different graph shapes can share zero first and second derivatives at a point, so sign information or another test is needed.",
          "topic": "second-derivative-test"
        },
        {
          "id": "h82",
          "q": "Why can a horizontal asymptote be crossed by a graph?",
          "a": [
            "An asymptote describes end behavior, not a barrier",
            "Horizontal asymptotes are calculation errors",
            "Only vertical asymptotes cannot be crossed",
            "The derivative must be zero there"
          ],
          "correct": 0,
          "why": "A horizontal asymptote describes what happens far away. It places no restriction on crossing at finite x-values.",
          "topic": "asymptotes"
        },
        {
          "id": "h85",
          "q": "What does limₓ→a f(x)=∞ indicate geometrically?",
          "a": [
            "A horizontal tangent",
            "Unbounded growth near the vertical line x=a",
            "A removable hole",
            "An absolute maximum at a"
          ],
          "correct": 1,
          "why": "The function values grow without bound as x approaches a, which is the characteristic behavior of a vertical asymptote.",
          "topic": "infinite-limits"
        },
        {
          "id": "h86",
          "q": "If y=L is a horizontal asymptote, what does that tell us about f?",
          "a": [
            "f(x) approaches L in an end direction",
            "f(x) never equals L",
            "L is the absolute maximum",
            "f′(x)=0 everywhere"
          ],
          "correct": 0,
          "why": "A horizontal asymptote records limiting behavior as x tends toward positive or negative infinity, not a global barrier.",
          "topic": "asymptotes"
        },
        {
          "id": "h90",
          "q": "Suppose f′(x)>0 for every x and f(x) approaches the horizontal asymptote y=L as x approaches infinity. Where must the graph lie?",
          "a": [
            "Below y=L while approaching it",
            "Above y=L while moving away from it",
            "Alternating above and below y=L",
            "Exactly on y=L for every x"
          ],
          "correct": 0,
          "why": "Because f is strictly increasing yet approaches the finite value L, its values must remain below L and rise toward it.",
          "topic": "asymptotic-synthesis"
        },
        {
          "id": "h92",
          "q": "The graph of f′ lies below the x-axis and rises toward it. What does this say about f?",
          "a": [
            "f decreases and is concave up",
            "f increases and is concave up",
            "f decreases and is concave down",
            "f is constant"
          ],
          "correct": 0,
          "why": "Values of f′ below zero make f decrease, while the rising derivative means f′ is increasing and f is concave up.",
          "topic": "derivative-graph"
        }
      ]
    ],
    "prizes": [
      100,
      200,
      500,
      1000,
      2000,
      5000,
      10000,
      25000,
      50000,
      100000,
      250000,
      1000000
    ],
    "checkpoints": [
      3,
      9
    ]
  },
  "university": {
    "key": "university",
    "label": "University",
    "description": "First-year university calculus concepts",
    "levels": [
      [
        {
          "id": "u01",
          "q": "What does differentiability at a point say beyond mere continuity?",
          "a": [
            "The function has a good local linear approximation",
            "The function has an inverse everywhere",
            "The second derivative exists",
            "The function is analytic"
          ],
          "correct": 0,
          "why": "Differentiability means the error after subtracting the tangent-line approximation is small compared with the input change.",
          "topic": "local-linearity"
        },
        {
          "id": "u03",
          "q": "Why is differentiation called a linear operation?",
          "a": [
            "It sends every function to a straight line",
            "It preserves sums and constant multiples",
            "It preserves products without extra terms",
            "It preserves compositions without extra factors"
          ],
          "correct": 1,
          "why": "For constants a and b, the derivative of af+bg equals af′+bg′, which is precisely linearity.",
          "topic": "derivative-operator"
        },
        {
          "id": "u04",
          "q": "What condition is needed before a function can have an inverse on its whole domain?",
          "a": [
            "It must be one-to-one",
            "It must be continuous",
            "It must be positive",
            "Its derivative must be nonzero everywhere"
          ],
          "correct": 0,
          "why": "Each output must come from only one input; otherwise the inverse relation would assign multiple outputs to one input.",
          "topic": "inverse-functions"
        },
        {
          "id": "u05",
          "q": "A derivative exists at an interior point. What follows automatically there?",
          "a": [
            "Continuity",
            "A local extremum",
            "A nonzero slope",
            "Existence of a second derivative"
          ],
          "correct": 0,
          "why": "Differentiability is stronger than continuity, though it does not guarantee extrema or higher derivatives.",
          "topic": "differentiability"
        },
        {
          "id": "u69",
          "q": "Why does the horizontal line test determine whether a function has an inverse?",
          "a": [
            "It checks whether each output comes from at most one input",
            "It checks whether every tangent is horizontal",
            "It finds all vertical asymptotes",
            "It proves the derivative is continuous"
          ],
          "correct": 0,
          "why": "Two intersections with one horizontal line would mean two inputs share an output, so the inverse relation would not be a function.",
          "topic": "inverse-functions"
        },
        {
          "id": "u54",
          "q": "In an engineering model, what does a negative derivative of a measured quantity indicate?",
          "a": [
            "The quantity is decreasing at that moment",
            "The quantity itself must be negative",
            "The model has no units",
            "The quantity is at a minimum"
          ],
          "correct": 0,
          "why": "The derivative describes direction and rate of change; a negative value means the quantity is currently falling.",
          "topic": "rate-interpretation"
        }
      ],
      [
        {
          "id": "u07",
          "q": "What is the central conclusion of the Mean Value Theorem?",
          "a": [
            "Some tangent slope equals the interval’s secant slope",
            "Every continuous function has a zero",
            "The endpoints have equal values",
            "Every derivative has an inverse"
          ],
          "correct": 0,
          "why": "Under the theorem’s hypotheses, an interior instantaneous rate matches the average rate across the interval.",
          "topic": "mean-value-theorem"
        },
        {
          "id": "u08",
          "q": "Rolle’s Theorem is a special case of the Mean Value Theorem in which…",
          "a": [
            "the endpoint values are equal",
            "the function is odd",
            "the second derivative vanishes",
            "the interval is unbounded"
          ],
          "correct": 0,
          "why": "Equal endpoint values make the secant slope zero, so Rolle’s Theorem guarantees an interior horizontal tangent.",
          "topic": "rolles-theorem"
        },
        {
          "id": "u09",
          "q": "If A(x)=∫₀ˣ f(t)dt for continuous f, what does the Fundamental Theorem give for A′(x)?",
          "a": [
            "f(x)",
            "f′(x)",
            "A(x)f(x)",
            "A(x)"
          ],
          "correct": 0,
          "why": "Differentiating the accumulation function recovers the value of the integrand at the moving upper bound.",
          "topic": "fundamental-theorem"
        },
        {
          "id": "u10",
          "q": "Why are both continuity and differentiability hypotheses stated in the Mean Value Theorem?",
          "a": [
            "Endpoint continuity and interior tangent slopes are both needed",
            "They are equivalent assumptions",
            "They guarantee the function is positive",
            "They force equal endpoint values"
          ],
          "correct": 0,
          "why": "Continuity controls the closed interval, while differentiability supplies tangent slopes throughout its interior.",
          "topic": "theorem-hypotheses"
        },
        {
          "id": "u11",
          "q": "If F′=f, how does the Fundamental Theorem evaluate ∫ₐᵇ f(x)dx?",
          "a": [
            "F(b)−F(a)",
            "F(a)+F(b)",
            "F′(b)−F′(a)",
            "F(b)/F(a)"
          ],
          "correct": 0,
          "why": "A definite integral of a continuous function equals the change in any antiderivative across the endpoints.",
          "topic": "fundamental-theorem"
        },
        {
          "id": "u12",
          "q": "A continuous function on a compact interval must attain its bounds. Which theorem states this?",
          "a": [
            "Extreme Value Theorem",
            "Mean Value Theorem",
            "Taylor’s Theorem",
            "Inverse Function Theorem"
          ],
          "correct": 0,
          "why": "The Extreme Value Theorem guarantees actual maximum and minimum values on a closed bounded interval.",
          "topic": "extreme-value-theorem"
        }
      ],
      [
        {
          "id": "u13",
          "q": "When is L’Hôpital’s rule potentially applicable?",
          "a": [
            "For appropriate 0/0 or ∞/∞ forms with the required differentiability",
            "For every quotient limit",
            "Only when both derivatives are zero",
            "Whenever the numerator is bounded"
          ],
          "correct": 0,
          "why": "The rule applies under specific hypotheses to indeterminate quotient forms, not automatically to every fraction.",
          "topic": "lhopital"
        },
        {
          "id": "u14",
          "q": "Why is 0·∞ called an indeterminate form?",
          "a": [
            "Different competing rates can lead to different limits",
            "Its value is always zero",
            "Its value is always infinity",
            "The expression is never defined near the limit"
          ],
          "correct": 0,
          "why": "One factor shrinks while the other grows, and their relative rates determine the final behavior.",
          "topic": "indeterminate-forms"
        },
        {
          "id": "u17",
          "q": "What is the main role of the Squeeze Theorem?",
          "a": [
            "To identify a limit by trapping a function between two functions with the same limit",
            "To prove a function is differentiable",
            "To integrate a product",
            "To find all extrema"
          ],
          "correct": 0,
          "why": "When the upper and lower bounds approach the same value, the trapped function must approach it as well.",
          "topic": "squeeze-theorem"
        },
        {
          "id": "u16",
          "q": "Why does the approximation sin(x) ≈ x near zero require x to be measured in radians?",
          "a": [
            "In radians, the derivative of sin(x) at zero is 1",
            "Sine is only defined for radian angles",
            "Degrees make sin(0) nonzero",
            "The approximation is exact for all radian angles"
          ],
          "correct": 0,
          "why": "With radian measure, the tangent line to sin(x) at zero is y=x. In degrees the slope includes a factor of π/180.",
          "topic": "small-angle-approximation"
        },
        {
          "id": "u06",
          "q": "If f has an inverse and f′(a)≠0, what determines the derivative of the inverse at f(a)?",
          "a": [
            "The reciprocal 1/f′(a)",
            "The value f′(a) itself",
            "The negative −f′(a)",
            "The second derivative f″(a)"
          ],
          "correct": 0,
          "why": "The inverse reverses the local scaling of f, so its derivative at the corresponding point is the reciprocal of f′(a).",
          "topic": "inverse-derivatives"
        },
        {
          "id": "u70",
          "q": "Suppose f is one-to-one on an interval containing a and f′(a)=0. What may happen to the inverse graph at the corresponding point?",
          "a": [
            "It may have a vertical tangent or fail to be differentiable",
            "Its tangent must also be horizontal",
            "It becomes constant everywhere",
            "It must cross the x-axis"
          ],
          "correct": 0,
          "why": "Reflecting a horizontal tangent across y=x can give a vertical tangent on the inverse graph. The usual reciprocal derivative formula does not give a finite derivative when f′(a)=0.",
          "topic": "inverse-derivatives"
        }
      ],
      [
        {
          "id": "u43",
          "q": "When differentiating an equation containing both x and y, why do terms involving y produce a factor y′?",
          "a": [
            "Because y is treated as a function of x and the chain rule applies",
            "Because y is held constant",
            "Because every y-term is integrated first",
            "Because y′ always equals one"
          ],
          "correct": 0,
          "why": "Implicit differentiation treats y as depending on x, so differentiating a function of y requires multiplication by dy/dx.",
          "topic": "implicit-differentiation"
        },
        {
          "id": "u44",
          "q": "What is the main purpose of implicit differentiation?",
          "a": [
            "To find slopes when y is not conveniently isolated",
            "To turn every curve into a line",
            "To remove all variables except constants",
            "To find definite integrals"
          ],
          "correct": 0,
          "why": "It obtains a derivative directly from a relation between x and y without first solving explicitly for y.",
          "topic": "implicit-differentiation"
        },
        {
          "id": "u45",
          "q": "In a related-rates problem, why are all changing quantities differentiated with respect to time?",
          "a": [
            "The rates in the relationship must use the same independent variable",
            "All changing quantities have the same numerical rate",
            "Substituting instantaneous values first preserves every rate term",
            "Differentiating with respect to time makes every rate positive"
          ],
          "correct": 0,
          "why": "Differentiating the shared relationship with respect to time connects the simultaneous rates of change.",
          "topic": "related-rates"
        },
        {
          "id": "u47",
          "q": "When is logarithmic differentiation especially helpful?",
          "a": [
            "For products, quotients, or variable powers",
            "Only when the expression already contains a logarithm",
            "Whenever the ordinary power rule applies, but never to variable powers",
            "Only when the function is a product of constants"
          ],
          "correct": 0,
          "why": "Logarithms turn products into sums and bring exponents down, simplifying complicated derivative structures.",
          "topic": "logarithmic-differentiation"
        },
        {
          "id": "u15",
          "q": "A small change Δx is made near x=a. Which expression gives the linear approximation to the change in f?",
          "a": [
            "f′(a)Δx",
            "f(a)Δx",
            "f′(a)/Δx",
            "f(a)+Δx"
          ],
          "correct": 0,
          "why": "The derivative is the local change in output per unit input. Multiplying by Δx estimates the output change: Δf ≈ f′(a)Δx.",
          "topic": "differentials"
        },
        {
          "id": "u24",
          "q": "Why is linearization the first Taylor approximation?",
          "a": [
            "It retains the constant and first-order derivative terms",
            "It uses the first root of the function",
            "It integrates along a line",
            "It assumes the function is globally linear"
          ],
          "correct": 0,
          "why": "Linearization keeps exactly the degree-zero and degree-one terms of the local Taylor expansion.",
          "topic": "linearization"
        }
      ],
      [
        {
          "id": "u49",
          "q": "At a critical point c, what does f″(c)>0 indicate when the second derivative test applies?",
          "a": [
            "A local minimum",
            "A local maximum",
            "A vertical asymptote",
            "No possible conclusion"
          ],
          "correct": 0,
          "why": "Positive second derivative means the graph bends upward around the horizontal tangent, producing a local minimum.",
          "topic": "second-derivative-test"
        },
        {
          "id": "u50",
          "q": "When searching for an absolute extremum on a closed interval, which candidates must be compared?",
          "a": [
            "Interior critical points and both endpoints",
            "Only points where f is zero",
            "Only the midpoint",
            "Only points where f″ is zero"
          ],
          "correct": 0,
          "why": "The closed-interval method compares function values at every interior critical point and at the endpoints.",
          "topic": "closed-interval-method"
        },
        {
          "id": "u51",
          "q": "Why must a physical optimization problem include a feasible domain?",
          "a": [
            "To exclude impossible values such as negative lengths",
            "To keep every algebraic critical point as a valid candidate",
            "To guarantee that every critical point is a maximum",
            "To allow endpoints to be ignored"
          ],
          "correct": 0,
          "why": "The domain encodes physical restrictions, ensuring that mathematical candidates make sense in the original problem.",
          "topic": "optimization-domain"
        },
        {
          "id": "u52",
          "q": "When is a tangent-line approximation generally most accurate?",
          "a": [
            "Near the point of tangency",
            "At every point equally",
            "Only at an x-intercept",
            "Far from the point of tangency"
          ],
          "correct": 0,
          "why": "Linearization is local: its neglected higher-order terms are smallest close to the expansion point.",
          "topic": "linearization"
        },
        {
          "id": "u46",
          "q": "What geometric idea drives Newton’s method?",
          "a": [
            "Use a tangent line to predict a nearby x-intercept",
            "Use a secant area to find a maximum",
            "Replace the graph by a horizontal line",
            "Reflect the graph in the y-axis"
          ],
          "correct": 0,
          "why": "Each Newton step follows the tangent-line approximation to where that line crosses the x-axis.",
          "topic": "newton-method"
        },
        {
          "id": "u53",
          "q": "Why can Newton’s method fail near a point where f′ is close to zero?",
          "a": [
            "The tangent step can become extremely large",
            "The method becomes exact immediately",
            "The graph must be discontinuous",
            "The root disappears"
          ],
          "correct": 0,
          "why": "Newton’s update divides by f′, so a very small derivative can produce an unstable, oversized step.",
          "topic": "newton-method"
        }
      ],
      [
        {
          "id": "u25",
          "q": "Conceptually, what does substitution do in an integral?",
          "a": [
            "It changes variables to match the chain rule in reverse",
            "It applies the product rule directly",
            "It always changes an improper integral to a proper one",
            "It differentiates the bounds only"
          ],
          "correct": 0,
          "why": "Substitution packages an inner function and its differential, reversing the chain rule.",
          "topic": "substitution"
        },
        {
          "id": "u26",
          "q": "Integration by parts is derived from which differentiation rule?",
          "a": [
            "The product rule",
            "The quotient rule",
            "The inverse function rule",
            "The mean value theorem"
          ],
          "correct": 0,
          "why": "Integrating the rearranged product rule produces the integration-by-parts identity.",
          "topic": "integration-parts"
        },
        {
          "id": "u27",
          "q": "When is partial-fraction decomposition naturally useful?",
          "a": [
            "For rational functions after any needed polynomial division and denominator factorization",
            "For any quotient by integrating numerator and denominator separately",
            "Only when the numerator has higher degree than the denominator",
            "Only when the denominator has no real roots"
          ],
          "correct": 0,
          "why": "After polynomial division if needed, a proper rational function can be decomposed into simpler fractions based on the denominator factors.",
          "topic": "partial-fractions"
        },
        {
          "id": "u28",
          "q": "What must happen to bounds when substitution is used directly in a definite integral?",
          "a": [
            "They should be converted to values of the new variable",
            "They must always be reversed",
            "They should be discarded",
            "They become derivatives"
          ],
          "correct": 0,
          "why": "Changing variables consistently includes expressing the endpoints in the new variable.",
          "topic": "change-of-variables"
        },
        {
          "id": "u29",
          "q": "For an odd function that is integrable on [−a,a], why does its integral over that interval vanish?",
          "a": [
            "Symmetric positive and negative contributions cancel",
            "Every odd function is zero",
            "Odd functions have no antiderivatives",
            "The interval has zero length"
          ],
          "correct": 0,
          "why": "When the integral exists, odd symmetry makes the signed contribution on one side the negative of the contribution on the other.",
          "topic": "integral-symmetry"
        },
        {
          "id": "u30",
          "q": "What connects an integrand to the derivative of its accumulation function?",
          "a": [
            "The Fundamental Theorem of Calculus",
            "The ratio test",
            "The implicit function theorem",
            "Green’s theorem"
          ],
          "correct": 0,
          "why": "The Fundamental Theorem says that differentiating accumulated integral area recovers the continuous integrand.",
          "topic": "fundamental-theorem"
        }
      ],
      [
        {
          "id": "u31",
          "q": "What makes an integral improper?",
          "a": [
            "An infinite interval or an unbounded integrand",
            "A negative integrand",
            "Non-elementary antiderivatives",
            "Variable bounds"
          ],
          "correct": 0,
          "why": "Improper integrals are defined through limits when the interval is infinite or the integrand becomes unbounded.",
          "topic": "improper-integrals"
        },
        {
          "id": "u32",
          "q": "For which p does the integral from 1 to ∞ of 1/xᵖ converge?",
          "a": [
            "p>1",
            "p≥0",
            "p<1",
            "Every real p"
          ],
          "correct": 0,
          "why": "The p-integral on [1,∞) converges exactly when the decay exponent exceeds one.",
          "topic": "p-integrals"
        },
        {
          "id": "u33",
          "q": "What does the comparison test use to establish convergence?",
          "a": [
            "A known convergent upper bound for a nonnegative integrand",
            "An exact antiderivative only",
            "Alternating signs",
            "A Taylor polynomial at zero"
          ],
          "correct": 0,
          "why": "If a nonnegative function is eventually no larger than a convergent comparison function, its integral also converges.",
          "topic": "comparison-test"
        },
        {
          "id": "u34",
          "q": "Why must an improper integral with an interior singularity be split?",
          "a": [
            "Each side of the singularity requires its own convergent limit",
            "The two sides always cancel",
            "The Fundamental Theorem forbids interior points",
            "Only one side can be integrated"
          ],
          "correct": 0,
          "why": "Convergence is required independently on both sides; cancellation across an undefined point is not allowed.",
          "topic": "singular-integrals"
        },
        {
          "id": "u35",
          "q": "What does absolute convergence of an improper integral imply?",
          "a": [
            "Convergence of the original integral",
            "Divergence of the original integral",
            "The integrand is positive",
            "The antiderivative is bounded everywhere"
          ],
          "correct": 0,
          "why": "If the integral of the absolute value converges, the signed integral necessarily converges as well.",
          "topic": "absolute-convergence"
        },
        {
          "id": "u36",
          "q": "Can an improper integral converge even when its integrand does not approach zero monotonically?",
          "a": [
            "Yes; monotonicity is not required in general",
            "No; monotonicity is mandatory",
            "Only on finite intervals",
            "Only for positive integrands"
          ],
          "correct": 0,
          "why": "Oscillation and cancellation can produce convergence without monotone decay, though the exact conditions must be checked.",
          "topic": "conditional-convergence"
        }
      ],
      [
        {
          "id": "u37",
          "q": "What necessary condition must hold for a numerical series to converge?",
          "a": [
            "Its terms must approach zero",
            "Its terms must be positive",
            "Its partial sums must be monotone",
            "Its ratio must approach zero"
          ],
          "correct": 0,
          "why": "If the individual terms fail to approach zero, the partial sums cannot settle to a finite limit.",
          "topic": "term-test"
        },
        {
          "id": "u38",
          "q": "When does a geometric series with ratio r converge?",
          "a": [
            "When |r|<1",
            "When r>1",
            "When r is an integer",
            "Whenever r is positive"
          ],
          "correct": 0,
          "why": "Powers of r decay to zero rapidly enough precisely when the absolute value of r is below one.",
          "topic": "geometric-series"
        },
        {
          "id": "u39",
          "q": "What does the ratio test primarily compare?",
          "a": [
            "The size of successive terms",
            "A series with its derivative",
            "Positive and negative partial sums",
            "The first term with the last"
          ],
          "correct": 0,
          "why": "The limiting magnitude of aₙ₊₁/aₙ reveals geometric-like decay or growth.",
          "topic": "ratio-test"
        },
        {
          "id": "u40",
          "q": "What extra condition accompanies decreasing magnitudes in the alternating series test?",
          "a": [
            "The term magnitudes approach zero",
            "The terms are differentiable",
            "The series begins with a positive term",
            "The ratio is exactly one"
          ],
          "correct": 0,
          "why": "Alternation alone is insufficient; the decreasing magnitudes must also tend to zero.",
          "topic": "alternating-series"
        },
        {
          "id": "u41",
          "q": "Why must endpoints be checked separately for a power series?",
          "a": [
            "The ratio test is usually inconclusive there",
            "Convergence inside the interval guarantees both endpoints",
            "Divergence outside the interval rules out both endpoints",
            "The two endpoints always have the same convergence behavior"
          ],
          "correct": 0,
          "why": "At the boundary of the radius, the usual ratio or root test often returns an inconclusive value of one.",
          "topic": "power-series"
        },
        {
          "id": "u42",
          "q": "What is conditional convergence?",
          "a": [
            "The series converges but the series of absolute values diverges",
            "The series converges absolutely",
            "The terms do not approach zero",
            "The sum depends on the first term only"
          ],
          "correct": 0,
          "why": "Conditional convergence relies on cancellation and is lost when all signs are replaced by absolute values.",
          "topic": "conditional-convergence"
        }
      ],
      [
        {
          "id": "u19",
          "q": "What determines the coefficient of (x−a)ⁿ in a Taylor series?",
          "a": [
            "The nth derivative at a divided by n!",
            "The first derivative at x",
            "The integral over the whole domain",
            "The largest function value"
          ],
          "correct": 0,
          "why": "Taylor coefficients encode derivative data at the center: f⁽ⁿ⁾(a)/n!.",
          "topic": "taylor-coefficients"
        },
        {
          "id": "u20",
          "q": "What should be checked before using a Taylor polynomial to estimate a function value?",
          "a": [
            "Whether the point is close enough to the center and the error is acceptable",
            "Whether the polynomial agrees with the function everywhere",
            "Whether all higher derivatives are zero",
            "Whether the function is a polynomial"
          ],
          "correct": 0,
          "why": "A Taylor polynomial is a local approximation. Its usefulness depends on the distance from the center and the size of the neglected terms.",
          "topic": "taylor-error"
        },
        {
          "id": "u21",
          "q": "What does the radius of convergence describe?",
          "a": [
            "How far from the center a power series converges",
            "The largest coefficient",
            "The error at the center",
            "The period of the represented function"
          ],
          "correct": 0,
          "why": "Inside the radius a power series converges absolutely; outside it diverges, while endpoints require separate checks.",
          "topic": "radius-convergence"
        },
        {
          "id": "u22",
          "q": "What information does Taylor’s remainder term provide?",
          "a": [
            "A bound or expression for approximation error",
            "The exact radius in every case",
            "Only the constant coefficient",
            "The locations of all roots"
          ],
          "correct": 0,
          "why": "The remainder quantifies what is left after truncating the Taylor polynomial.",
          "topic": "taylor-remainder"
        },
        {
          "id": "u23",
          "q": "What extra information does a quadratic Taylor approximation include compared with a linear one?",
          "a": [
            "The second derivative at the expansion point",
            "The exact function values throughout the interval",
            "The integral over the whole domain",
            "The location of every turning point"
          ],
          "correct": 0,
          "why": "The quadratic term f″(a)(x−a)²/2 accounts for bending that the tangent-line approximation misses.",
          "topic": "quadratic-approximation"
        },
        {
          "id": "u18",
          "q": "Why can a Taylor expansion resolve a difficult limit?",
          "a": [
            "It exposes the first non-cancelling orders of small quantities",
            "It makes every function a polynomial globally",
            "It eliminates the need for convergence",
            "It proves the denominator is nonzero"
          ],
          "correct": 0,
          "why": "Local expansions reveal which powers dominate after leading terms cancel.",
          "topic": "taylor-limits"
        }
      ],
      [
        {
          "id": "u55",
          "q": "What makes an ordinary differential equation separable?",
          "a": [
            "It can be rearranged with each variable and its differential on one side",
            "It has constant coefficients",
            "It is always second order",
            "Its solution is a polynomial"
          ],
          "correct": 0,
          "why": "Separation isolates a function of the dependent variable from a function of the independent variable before integration.",
          "topic": "separable-odes"
        },
        {
          "id": "u56",
          "q": "What is the purpose of an integrating factor for a first-order linear ODE?",
          "a": [
            "To turn the left side into a product derivative",
            "To remove the initial condition",
            "To make the equation separable in every case",
            "To find characteristic roots"
          ],
          "correct": 0,
          "why": "Multiplication by the integrating factor packages the left side as the derivative of a product.",
          "topic": "linear-odes"
        },
        {
          "id": "u57",
          "q": "What is an equilibrium solution of an autonomous ODE?",
          "a": [
            "A constant solution where the rate of change is zero",
            "A periodic solution only",
            "A solution with zero initial value",
            "Any linear solution"
          ],
          "correct": 0,
          "why": "At an equilibrium, the right-hand side vanishes and the dependent variable remains constant.",
          "topic": "equilibria"
        },
        {
          "id": "u58",
          "q": "For y′=g(y), suppose g(y)>0 just below an equilibrium and g(y)<0 just above it. What do nearby solutions do?",
          "a": [
            "Move toward the equilibrium as time increases",
            "Move away from the equilibrium on both sides",
            "Move upward on both sides",
            "Move downward on both sides"
          ],
          "correct": 0,
          "why": "Below the equilibrium the positive derivative makes y increase; above it the negative derivative makes y decrease. Both directions point toward the equilibrium.",
          "topic": "equilibrium-behavior"
        },
        {
          "id": "u59",
          "q": "What must be checked when separating y′=y(1−y) by dividing by y(1−y)?",
          "a": [
            "The constant solutions y=0 and y=1, which division would exclude",
            "Only whether time is positive",
            "Whether every solution is linear",
            "Only the solution y=1/2"
          ],
          "correct": 0,
          "why": "Division assumes y(1−y)≠0. The excluded values y=0 and y=1 both solve the original equation and must be checked separately.",
          "topic": "separation-equilibria"
        },
        {
          "id": "u60",
          "q": "When does the superposition principle apply to ODE solutions?",
          "a": [
            "For homogeneous linear equations",
            "For all nonlinear equations",
            "Only for separable equations",
            "Only when initial values vanish"
          ],
          "correct": 0,
          "why": "Linearity and homogeneity ensure that linear combinations of solutions are again solutions.",
          "topic": "superposition"
        }
      ],
      [
        {
          "id": "u61",
          "q": "If v(t) is the velocity of an object moving along a line, how do you find its total distance travelled on [a,b]?",
          "a": [
            "Integrate |v(t)| from a to b",
            "Integrate v(t) and then take the absolute value in every case",
            "Subtract v(a) from v(b)",
            "Integrate v′(t) from a to b"
          ],
          "correct": 0,
          "why": "Total distance adds all motion positively, including motion in the negative direction. Integrating velocity without the absolute value gives displacement.",
          "topic": "distance-displacement"
        },
        {
          "id": "u62",
          "q": "A tank has inflow rate rᵢₙ(t) and outflow rate rₒᵤₜ(t). What gives the change in its volume over a time interval?",
          "a": [
            "The integral of inflow rate minus outflow rate",
            "The integral of inflow rate plus outflow rate",
            "The difference between the endpoint inflow rates",
            "The integral of the absolute value of the net flow"
          ],
          "correct": 0,
          "why": "The volume changes at the net rate rᵢₙ−rₒᵤₜ. Integrating that net rate gives the volume change, which may be positive or negative.",
          "topic": "net-change"
        },
        {
          "id": "u63",
          "q": "How is the average value of a continuous function f on [a,b], with a<b, found?",
          "a": [
            "Divide ∫ₐᵇ f(x)dx by b−a",
            "Use (f(a)+f(b))/2 in every case",
            "Divide f(b)−f(a) by b−a",
            "Evaluate f only at the midpoint in every case"
          ],
          "correct": 0,
          "why": "The average value is accumulated function value divided by interval length: (1/(b−a))∫ₐᵇ f(x)dx. This differs from average rate of change.",
          "topic": "average-value"
        },
        {
          "id": "u64",
          "q": "For a continuous, concave-up function, how does the trapezoidal rule compare with the exact integral?",
          "a": [
            "It overestimates the integral",
            "It underestimates the integral",
            "It is exact for every such function",
            "The sign of f alone determines the error"
          ],
          "correct": 0,
          "why": "For a concave-up graph, each secant segment lies on or above the graph. The trapezoids therefore give an estimate at least as large as the integral.",
          "topic": "trapezoidal-rule"
        },
        {
          "id": "u65",
          "q": "What does one step of Euler’s method for y′=f(t,y) use?",
          "a": [
            "The current slope to estimate the next value of y",
            "The exact integral of f over the whole interval",
            "The slope at the unknown final solution only",
            "The second derivative in place of the first derivative"
          ],
          "correct": 0,
          "why": "Euler’s method follows a short tangent step: y at the next time is estimated by the current y plus step size times the current slope.",
          "topic": "euler-method"
        },
        {
          "id": "u66",
          "q": "If a numerical approximation changes very little after halving the step size, what is a sensible conclusion?",
          "a": [
            "This is useful evidence of accuracy, but not a guarantee",
            "The approximation must now be exact",
            "Rounding error has been eliminated",
            "The underlying mathematical model must be correct"
          ],
          "correct": 0,
          "why": "Comparing step sizes is a useful accuracy check. Agreement alone does not prove exactness or validate the model, and rounding or other errors may still matter.",
          "topic": "numerical-validation"
        }
      ],
      [
        {
          "id": "u67",
          "q": "If f is continuous, A(x)=∫₀ˣ f(t)dt, and f changes from positive to negative at c, what happens to A at c?",
          "a": [
            "A has a local maximum",
            "A has a local minimum",
            "A becomes discontinuous",
            "A must equal zero"
          ],
          "correct": 0,
          "why": "The Fundamental Theorem gives A′=f, so A changes from increasing to decreasing when f changes from positive to negative.",
          "topic": "fundamental-theorem"
        },
        {
          "id": "u68",
          "q": "If f is continuous, positive, and decreasing, what is true of A(x)=∫₀ˣ f(t)dt?",
          "a": [
            "A increases and is concave down",
            "A decreases and is concave down",
            "A increases and is concave up",
            "A is constant"
          ],
          "correct": 0,
          "why": "Since A′=f, the accumulation function has positive, decreasing slopes. Therefore A increases and is concave down.",
          "topic": "accumulation-concavity"
        },
        {
          "id": "u71",
          "q": "What feature of a sufficiently smooth function largely controls the error of the trapezoidal rule?",
          "a": [
            "The size of its second derivative over the interval",
            "Its value at zero only",
            "Whether it is odd",
            "The sign of its first derivative only"
          ],
          "correct": 0,
          "why": "The trapezoidal rule replaces the graph by straight segments, and its error bound depends on the magnitude of the second derivative.",
          "topic": "numerical-integration"
        },
        {
          "id": "u72",
          "q": "For y′=−ky with k>0 and y(0)>0, what is the long-term behavior of y?",
          "a": [
            "It decreases toward zero without reaching zero in finite time",
            "It decreases linearly and reaches zero in finite time",
            "It increases exponentially",
            "It becomes negative after crossing zero"
          ],
          "correct": 0,
          "why": "The solution y(t)=y(0)e^(−kt) stays positive and decreases toward zero. The rate slows as the quantity gets smaller.",
          "topic": "exponential-decay"
        },
        {
          "id": "u48",
          "q": "Why can numerical differentiation amplify measurement noise?",
          "a": [
            "It divides small differences in measured values by a small input step",
            "It averages all errors to zero",
            "It never uses nearby values",
            "It replaces data with exact formulas"
          ],
          "correct": 0,
          "why": "Small measurement errors can become large relative to the tiny differences used in a derivative estimate.",
          "topic": "numerical-differentiation"
        },
        {
          "id": "u02",
          "q": "What do two initial conditions normally determine for a second-order linear ODE?",
          "a": [
            "One particular solution from the two-parameter family",
            "The order of the equation",
            "Whether every solution is constant",
            "Only the characteristic equation"
          ],
          "correct": 0,
          "why": "A second-order general solution contains two arbitrary constants, and two suitable initial conditions determine them.",
          "topic": "initial-value-problems"
        }
      ]
    ],
    "prizes": [
      100,
      200,
      500,
      1000,
      2000,
      5000,
      10000,
      25000,
      50000,
      100000,
      250000,
      1000000
    ],
    "checkpoints": [
      3,
      9
    ]
  }
};
bank.levels=bank.highSchool.levels;bank.prizes=bank.highSchool.prizes;bank.checkpoints=bank.highSchool.checkpoints;
if(typeof module==='object'&&module.exports)module.exports=bank;
root.CalculusMillionaireQuestions=bank;
})(typeof globalThis!=='undefined'?globalThis:this);
