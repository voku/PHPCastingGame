import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Null Integer",
    incomingValueDisplay: "null",
    incomingValueType: "mixed",
    targetType: "int",
    variableName: "$userId",
    contextCode: "function processUser(int $userId): void",
    
    hammerCast: "(int)",
    hammerResultDisplay: "0",
    hammerFeedback: "The door fits... but the user is gone!",
    hammerDamage: 20,
    hammerScore: 0,
    
    measureAction: "RequestPost::getIntOrNull('userId')",
    measureFeedback: "Safe. Returns ?int so you handle null explicitly.",
    measureScore: 150,
    
    explanation: "Analogy: The Mannequin Pilot. Casting null to 0 is like replacing a missing pilot with a mannequin. Technically the seat is occupied (int), but the plane isn't flying. You just gave User #0 (often Admin) access to nobody."
  },
  {
    id: 2,
    title: "The Alphabet Soup",
    incomingValueDisplay: "'abc'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$page",
    contextCode: "$page = $_GET['page']; // Expected int",
    
    hammerCast: "(int)",
    hammerResultDisplay: "0",
    hammerFeedback: "It compiled, but your page is now 0.",
    hammerDamage: 25,
    hammerScore: 0,
    
    measureAction: "RequestQuery::getInt('page')",
    measureFeedback: "Correct. Throws ValidationException on 'abc'.",
    measureScore: 150,
    
    explanation: "Analogy: The Wood Chipper. Casting 'abc' to 0 is like shoving a square peg into a round hole by grinding it down to sawdust. It fits now, but you destroyed the peg. Invalid input should be rejected, not erased."
  },
  {
    id: 3,
    title: "The False Positive",
    incomingValueDisplay: "'false'",
    incomingValueType: "string",
    targetType: "bool",
    variableName: "$isAdmin",
    contextCode: "function setAdmin(bool $isAdmin)",
    
    hammerCast: "(bool)",
    hammerResultDisplay: "true",
    hammerFeedback: "WAIT! The string 'false' became TRUE!",
    hammerDamage: 50,
    hammerScore: 0,
    
    measureAction: "Request::getBool('isAdmin')",
    measureFeedback: "Smart. Handles 'true'/'false'/1/0 logic correctly.",
    measureScore: 150,
    
    explanation: "Analogy: The Neon Sign. A non-empty string is always True. It's like a neon sign that says 'CLOSED'. You see the light (True) and ignore the text. Logic gets completely inverted."
  },
  {
    id: 4,
    title: "The Truncated Float",
    incomingValueDisplay: "10.99",
    incomingValueType: "float",
    targetType: "int",
    variableName: "$price",
    contextCode: "function chargeCreditCard(int $cents)",
    
    hammerCast: "(int)",
    hammerResultDisplay: "10",
    hammerFeedback: "You just lost money due to rounding.",
    hammerDamage: 30,
    hammerScore: 0,
    
    measureAction: "Money::fromFloat($price)->cents()",
    measureFeedback: "Precision preserved via domain object.",
    measureScore: 150,
    
    explanation: "Analogy: The Bad Cashier. Casting float to int truncates toward zero. It's like paying $10.99 with a $10 bill and walking away. The system doesn't complain, but your accounting is now broken."
  },
  {
    id: 5,
    title: "The Strict Boundary",
    incomingValueDisplay: "'123'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$legacyId",
    contextCode: "declare(strict_types=1);\nfn process(int $id);",
    
    hammerCast: "(int)",
    hammerResultDisplay: "123",
    hammerFeedback: "It works... for now. But you're hammering blindly.",
    hammerDamage: 10,
    hammerScore: 50, // Small points because it happened to work
    
    measureAction: "RequestPost::getInt('id')",
    measureFeedback: "Perfect. Parsed at the boundary.",
    measureScore: 200,
    
    explanation: "Analogy: Passport Control. You don't verify identity inside the airplane; you do it at the gate. Senior code parses at the boundary (HTTP/CLI) so the inner domain never sees raw strings."
  },
  {
    id: 6,
    title: "The Arithmetic Warning",
    incomingValueDisplay: "'10 monkeys'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$total",
    contextCode: "$res = $total + 5; // PHP 8+",
    
    hammerCast: "(int)",
    hammerResultDisplay: "10",
    hammerFeedback: "PHP 8 throws a Warning/Error for this arithmetic!",
    hammerDamage: 40,
    hammerScore: 0,
    
    measureAction: "Request::getInt('total')",
    measureFeedback: "Correct. Strings aren't numbers anymore.",
    measureScore: 150,
    
    explanation: "Legacy Trap: In PHP 7, '10 monkeys' + 5 was 15 (Notice). In PHP 8, this behavior is heavily discouraged and throws Warnings or TypeErrors. A senior dev cleans this data up before math."
  },
  {
    id: 7,
    title: "The Scientific Trap",
    incomingValueDisplay: "'2e5'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$distance",
    contextCode: "$meters = (int) $_GET['dist'];",
    
    hammerCast: "(int)",
    hammerResultDisplay: "2",
    hammerFeedback: "200,000 meters just became 2 meters.",
    hammerDamage: 60,
    hammerScore: 0,
    
    measureAction: "Request::getFloat('dist')",
    measureFeedback: "Correctly interpreted scientific notation.",
    measureScore: 150,
    
    explanation: "Analogy: The Language Barrier. Scientific notation ('2e5') is foreign to the integer hammer. It reads the '2', hits the 'e', and gives up. You just confused 200,000 atoms for 2."
  },
  {
    id: 8,
    title: "The Invisible Boolean",
    incomingValueDisplay: "false",
    incomingValueType: "bool",
    targetType: "string",
    variableName: "$status",
    contextCode: "echo 'Status: ' . (string) $status;",
    
    hammerCast: "(string)",
    hammerResultDisplay: "", // Empty string
    hammerFeedback: "Your log file says 'Status: '. It's empty.",
    hammerDamage: 15,
    hammerScore: 0,
    
    measureAction: "$status ? 'true' : 'false'",
    measureFeedback: "Explicit conversion preserves meaning.",
    measureScore: 100,
    
    explanation: "Analogy: Invisible Ink. Casting false to string results in an empty string. You wrote 'False' on the paper, but the hammer turned it into invisible ink. The page looks blank, but the danger is hidden."
  },
  {
    id: 9,
    title: "The Null Deprecation",
    incomingValueDisplay: "null",
    incomingValueType: "mixed",
    targetType: "string",
    variableName: "$name",
    contextCode: "echo htmlspecialchars($name);",
    
    hammerCast: "(string)",
    hammerResultDisplay: "",
    hammerFeedback: "Implicit cast works, but passing null is deprecated.",
    hammerDamage: 10,
    hammerScore: 0,
    
    measureAction: "$name ?? ''",
    measureFeedback: "Senior move. Handle null coalescing explicitly.",
    measureScore: 150,
    
    explanation: "PHP 8.1+ Deprecation: Passing null to internal string functions is deprecated. Relying on the implicit cast inside the function call generates log noise. Be explicit: ($val ?? '') is clean code."
  },
  {
    id: 10,
    title: "The Array Blanket",
    incomingValueDisplay: "null",
    incomingValueType: "mixed",
    targetType: "array",
    variableName: "$items",
    contextCode: "foreach ((array)$items as $i) { ... }",
    
    hammerCast: "(array)",
    hammerResultDisplay: "[]",
    hammerFeedback: "Loop ran 0 times. Error suppressed.",
    hammerDamage: 25,
    hammerScore: 0,
    
    measureAction: "Type::ensureArray($items)",
    measureFeedback: "Error caught. Data source was down.",
    measureScore: 150,
    
    explanation: "Analogy: The Empty Gift Box. You ordered a gift (null/missing), but the system wrapped nothing in a box. You thank them for the box, not realizing it's empty. Don't suppress errors; handle them."
  },
  {
    id: 11,
    title: "The Phantom String",
    incomingValueDisplay: "null",
    incomingValueType: "mixed",
    targetType: "string",
    variableName: "$rollStatus",
    contextCode: "log('Roll: ' . (string)$rollStatus);",
    
    hammerCast: "(string)",
    hammerResultDisplay: "",
    hammerFeedback: "The log says 'Roll: '. Is it empty? Or missing?",
    hammerDamage: 20,
    hammerScore: 0,
    
    measureAction: "$val ?? 'Not Found'",
    measureFeedback: "Clear. 'Not Found' is distinct from an empty string.",
    measureScore: 150,
    
    explanation: "Analogy: The Toilet Roll vs. The Bidet. An empty roll means 'refill needed' (empty string). No holder means 'we don't use paper' (null). Casting forces them both to look like an empty roll, erasing the critical difference."
  },
  {
    id: 12,
    title: "The Environment Port",
    incomingValueDisplay: "'8080'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$port",
    contextCode: "$port = getenv('APP_PORT');",
    
    hammerCast: "(int)",
    hammerResultDisplay: "8080",
    hammerFeedback: "Efficient. Boundaries are where casting belongs.",
    hammerDamage: 0,
    hammerScore: 200, // HIGH SCORE - Efficient
    
    measureAction: "Env::getInt('APP_PORT')",
    measureFeedback: "Safe, but unnecessary validation overhead here.",
    measureScore: 80, // LOWER SCORE - Over-engineering
    
    explanation: "Analogy: The Customs Checkpoint. At the border (environment variables), raw strings are expected. Casting here is acceptable because you are formally bringing data into your domain. But validation is still safer."
  },
  {
    id: 13,
    title: "The API ID",
    incomingValueDisplay: "'450'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$apiId",
    contextCode: "$id = $jsonPayload['id'];",
    
    hammerCast: "(int)",
    hammerResultDisplay: "450",
    hammerFeedback: "Correct. The API contract is reliable here.",
    hammerDamage: 0,
    hammerScore: 200, // HIGH SCORE
    
    measureAction: "Payload::getInt('id')",
    measureFeedback: "Verified. A bit defensive, but okay.",
    measureScore: 100, // MED SCORE
    
    explanation: "Analogy: The Trusty Courier. When consuming a known API, casting an ID from string (JSON default) to int is often the correct move, provided the contract is strict."
  },
  {
    id: 14,
    title: "The CLI Flag",
    incomingValueDisplay: "'verbose'",
    incomingValueType: "string",
    targetType: "bool",
    variableName: "$isVerbose",
    contextCode: "$isVerbose = $argv[1] ?? false;",
    
    hammerCast: "(bool)",
    hammerResultDisplay: "true",
    hammerFeedback: "Correct. Flag presence = true.",
    hammerDamage: 5,
    hammerScore: 180,
    
    measureAction: "Console::getOption('verbose')",
    measureFeedback: "Precise. Checked for the specific flag.",
    measureScore: 150,
    
    explanation: "Analogy: The Light Switch. CLI flags are often just presence checks. Casting a non-empty string to true works for toggle flags, though checking the specific string value is more robust."
  },
  {
    id: 15,
    title: "The Legacy Return",
    incomingValueDisplay: "'99.9'",
    incomingValueType: "string",
    targetType: "float",
    variableName: "$score",
    contextCode: "$score = LegacyLib::getScore();",
    
    hammerCast: "(float)",
    hammerResultDisplay: "99.9",
    hammerFeedback: "Good. Stabilized legacy output efficiently.",
    hammerDamage: 0,
    hammerScore: 200,
    
    measureAction: "is_numeric($score)",
    measureFeedback: "Verified. Trust but verify.",
    measureScore: 100,
    
    explanation: "Analogy: The Universal Adaptor. When dealing with legacy code that returns loose types, casting at the interface is like using a travel adaptor. It safely converts the output to what your modern code expects."
  },
  {
    id: 16,
    title: "The Stringable Exception",
    incomingValueDisplay: "Exception Object",
    incomingValueType: "mixed",
    targetType: "string",
    variableName: "$e",
    contextCode: "catch (Exception $e) {\n  error_log((string)$e);\n}",

    hammerCast: "(string)",
    hammerResultDisplay: "\"Stack trace...\"",
    hammerFeedback: "Perfect. It converts to a full trace.",
    hammerDamage: 0,
    hammerScore: 200,

    measureAction: "$e->getMessage()",
    measureFeedback: "Valid, but you lost the stack trace.",
    measureScore: 80, // Lower, because (string) is actually better here

    explanation: "Analogy: The Translator. Exceptions are designed to speak 'String'. Casting them invokes their internal translator (__toString), giving you the full story (stack trace) rather than just the headline (message)."
  },
  {
    id: 17,
    title: "The Database Flag",
    incomingValueDisplay: "1",
    incomingValueType: "int",
    targetType: "bool",
    variableName: "$isActive",
    contextCode: "$isActive = (bool) $row['is_active'];",

    hammerCast: "(bool)",
    hammerResultDisplay: "true",
    hammerFeedback: "Standard practice. 1 is true.",
    hammerDamage: 0,
    hammerScore: 200,

    measureAction: "DB::toBool($val)",
    measureFeedback: "Valid, but verbose for simple flags.",
    measureScore: 80,

    explanation: "Analogy: The Light Switch. Databases often lack a true boolean type, using 0 and 1. Casting these integers to boolean is exactly what the system expects. It's a direct, lossless mapping."
  },
  {
    id: 18,
    title: "The Unix Timestamp",
    incomingValueDisplay: "'1709856000'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$ts",
    contextCode: "$time = (int) $apiResponse['ts'];",

    hammerCast: "(int)",
    hammerResultDisplay: "1709856000",
    hammerFeedback: "Safe. Timestamps are whole numbers.",
    hammerDamage: 0,
    hammerScore: 200,

    measureAction: "Carbon::createFromTimestamp($ts)",
    measureFeedback: "Correct, validation is always good.",
    measureScore: 100,

    explanation: "Analogy: The Digital Clock. A Unix timestamp is just a count of seconds. Even if it arrives as a string, it contains no hidden decimals or formatting characters. Casting it to an integer is safe and standard."
  },
  {
    id: 19,
    title: "The Magic Zero",
    incomingValueDisplay: "'password123'",
    incomingValueType: "string",
    targetType: "int",
    variableName: "$input",
    contextCode: "// Legacy Auth: if ($input == 0) ...\n(int) $input",
    
    hammerCast: "(int)",
    hammerResultDisplay: "0",
    hammerFeedback: "DANGEROUS. You just allowed 'password123' to equal 0.",
    hammerDamage: 80,
    hammerScore: 0,
    
    measureAction: "RequestPost::getString('password')",
    measureFeedback: "Strict typing saves the day. 'password123' !== 0.",
    measureScore: 200,
    
    explanation: "The Classic Vulnerability: 'Magic Switch'. Casting a string like 'admin' to int gives 0. If your code checks `if ($password == 0)`, the hammer just logged the attacker in as admin. ALWAYS use strict comparison `===`."
  },
  {
    id: 20,
    title: "The Float Key Truncation",
    incomingValueDisplay: "15.9",
    incomingValueType: "float",
    targetType: "mixed",
    variableName: "$key",
    contextCode: "$array[$key] = 'value';",
    
    hammerCast: "(Implicit Int)",
    hammerResultDisplay: "15",
    hammerFeedback: "Silent data loss. Key 15.9 became 15.",
    hammerDamage: 30,
    hammerScore: 0,
    
    measureAction: "(string)$key",
    measureFeedback: "Preserved. Used '15.9' as string key.",
    measureScore: 150,
    
    explanation: "PHP Array Keys: Arrays can only have int or string keys. Floats are silently cast to int (truncated). $arr[15.9] overwrites $arr[15]. This is a frequent source of hard-to-debug data overwrites in legacy processing scripts."
  },
  {
    id: 21,
    title: "The Insecure Instantiation",
    incomingValueDisplay: "'App\\Evil'",
    incomingValueType: "string",
    targetType: "object",
    variableName: "$driver",
    contextCode: "$cls = $_SESSION['driver_class'];\n$obj = new $cls();",

    hammerCast: "new (string)",
    hammerResultDisplay: "App\\Evil Object",
    hammerFeedback: "Security Risk! You just instantiated an arbitrary class.",
    hammerDamage: 90,
    hammerScore: 0,

    measureAction: "RequestSession::getClassString('driver', Driver::class)",
    measureFeedback: "Safe. Ensures input is a valid subclass of Driver.",
    measureScore: 200,

    explanation: "Object Injection: Letting user input determine class names is dangerous. Using a typed accessor like `getClassString` validates that the string exists AND implements the expected interface/parent class."
  }
];