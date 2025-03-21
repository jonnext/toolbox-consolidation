import { FC } from "react";

interface ProjectBannerProps {
  title: string;
  description: string;
}

const ProjectBanner: FC<ProjectBannerProps> = ({ title, description }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-start items-start gap-4 w-full max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg shadow border border-gray-300">
          <div className="relative w-2 h-2">
            <div className="absolute left-[1px] top-[1px] w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </div>
          <div className="text-center text-gray-700 text-sm font-medium leading-tight">
            PROJECT
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-black text-5xl font-medium leading-tight">
            {title}
          </h1>
          <p className="text-gray-900 text-xl leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectBanner;
