import React from "react";

// Color and icon mapping for note types
const NOTE_TYPE_META = {
  simplify: {
    color: "bg-blue-50 border-blue-200 text-blue-800",
    icon: (
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    label: "Concept Simplified",
  },
  explain: {
    color: "bg-purple-50 border-purple-200 text-purple-800",
    icon: (
      <svg
        className="w-5 h-5 text-purple-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
        />
      </svg>
    ),
    label: "Concept Explained",
  },
  example: {
    color: "bg-green-50 border-green-200 text-green-800",
    icon: (
      <svg
        className="w-5 h-5 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    label: "Practical Example",
  },
};

// Simple AWS service keyword detection
const AWS_SERVICES = [
  "Lex",
  "Polly",
  "EC2",
  "IAM",
  "S3",
  "Lambda",
  "CloudFormation",
  "DynamoDB",
  "SNS",
  "SQS",
  "VPC",
  "CloudWatch",
  "ECS",
  "EKS",
  "RDS",
  "SageMaker",
  "Glue",
  "Athena",
  "Redshift",
  "Kinesis",
  "Step Functions",
];
function detectServices(text: string): string[] {
  if (!text) return [];
  const found = AWS_SERVICES.filter((service) =>
    new RegExp(`\\b${service}\\b`, "i").test(text)
  );
  return found;
}

interface LearningContextBannerProps {
  noteType: string;
  highlightedText: string;
  relationshipStatement?: string;
  onDelete?: () => void;
}

const LearningContextBanner: React.FC<LearningContextBannerProps> = ({
  noteType,
  highlightedText,
  relationshipStatement,
  onDelete,
}) => {
  const typeKey = noteType?.toLowerCase().includes("example")
    ? "example"
    : noteType?.toLowerCase().includes("simplify")
    ? "simplify"
    : "explain";
  const meta = NOTE_TYPE_META[typeKey];
  return (
    <div
      className={`w-full rounded-xl border px-4 py-3 mb-4 flex items-center justify-between relative ${meta.color}`}
    >
      <div className="flex items-center gap-2">
        {meta.icon}
        <span className="font-semibold text-base tracking-wide">
          {meta.label}
        </span>
      </div>
      {onDelete && (
        <div className="flex items-center relative">
          <button
            onClick={onDelete}
            className="ml-4 p-2 rounded-full hover:bg-blue-100 focus:outline-none flex items-center justify-center group relative"
            aria-label="Delete note"
            type="button"
            style={{ lineHeight: 0 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8L20 20M20 8L8 20"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
              Delete note
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningContextBanner;
