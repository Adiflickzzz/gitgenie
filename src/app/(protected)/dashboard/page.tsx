"use client";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import { Button } from "@/components/ui/button";
import { DeleteProject } from "./actions";

type Props = {};

const DashboardPage = (props: Props) => {
  const { project } = useProject();

  const onDelete = async (projectId: string) => {
    await DeleteProject(projectId);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* Github link */}
        <div className="flex items-center gap-5">
          <div className="w-fit rounded-md bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <Github className="size-5 text-white" />
              <div className="flex items-center text-sm font-medium text-white">
                {!project ? (
                  `Link a project to get started`
                ) : (
                  <div>This project it linked to </div>
                )}
                <Link
                  href={project ? project.githubUrl : "/create"}
                  className="items-center gap-2 text-white/80 hover:underline"
                >
                  <div className="flex items-center">
                    {!project ? `${" "}` : project?.githubUrl}
                    <ExternalLink className="ml-2 size-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-4"></div>
        {project && (
          <div className="flex w-full items-center gap-4 lg:w-auto">
            <Button
              onClick={() => onDelete(project.id)}
              className="w-full py-5 transition-all hover:bg-red-500 hover:text-white"
              variant="outline"
            >
              Remove this project <Trash2 />
            </Button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
          Meeting card
        </div>
      </div>

      <div className="mt-8">
        <CommitLog />
      </div>
    </div>
  );
};

export default DashboardPage;
