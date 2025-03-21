import React from "react";
import {
  Clock,
  DollarSign,
  BarChart,
  Laptop2,
  Cloud,
  LucideIcon,
} from "lucide-react";

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 p-2 rounded-md shadow border border-gray-200 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-gray-900 text-sm font-semibold">{label}</div>
    </div>
    <div className="text-gray-900 text-sm">{value}</div>
  </div>
);

const ProjectInfoCard: React.FC = () => {
  return (
    <div className="w-full max-w-3xl py-12 border-y border-gray-200 flex flex-col gap-8">
      <div className="flex items-start gap-12">
        <InfoRow icon={BarChart} label="DIFFICULTY" value="Easy peasy" />
        <InfoRow icon={Clock} label="TIME" value="2 - 2.5 hour" />
        <InfoRow icon={DollarSign} label="COST" value="$0" />
      </div>

      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 p-2 rounded-md shadow border border-gray-200 flex items-center justify-center">
            <Laptop2 className="w-4 h-4" />
          </div>
          <div className="text-gray-900 text-sm font-semibold">
            WHAT YOU'LL NEED
          </div>
        </div>
        <div className="max-w-md text-gray-600 text-sm text-left">
          An internet connection.
          <br />
          A notebook computer running Microsoft Windows, macOS, or Linux
          (Ubuntu, SUSE, or Red Hat).
          <br />
          An AWS account - don't know how to create one? Here's how!
          <br />
          An internet browser e.g. Chrome or Firefox. Note: This project is not
          compatible with Internet Explorer 11.
          <br />
          For Microsoft Windows users, administrator access to the computer.
        </div>
      </div>

      <div className="flex items-start gap-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 p-2 rounded-md shadow border border-gray-200 flex items-center justify-center">
            <Cloud className="w-4 h-4" />
          </div>
          <div className="text-gray-900 text-sm font-semibold">
            AWS SERVICES
          </div>
        </div>
        <div className="max-w-md text-gray-600 text-sm text-left">
          Amazon Lex
          <br />
          Amazon Lambda
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
