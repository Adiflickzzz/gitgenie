"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};
const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  function onsubmit(data: FormInput) {
    console.log(JSON.stringify(data, null, 2));
    return true;
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 md:flex-row md:gap-8 lg:gap-12">
      <img
        src="/github.svg"
        alt="github"
        className="h-36 w-auto md:h-40 lg:h-48"
      />
      <div>
        <div>
          <h1 className="text-nowrap text-sm font-semibold md:text-lg lg:text-xl">
            Link your GitHub Repo.
          </h1>
          <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
            Enter the URL of your GitHub repository to link it to Github Assist
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="flex flex-col gap-2">
              <Input
                {...register("projectName", { required: true })}
                placeholder="Project Name"
                className="w-full text-xs"
                required
              />
              <Input
                {...register("repoUrl", { required: true })}
                placeholder="Github Url"
                className="w-full text-xs"
                type="url"
              />
              <Input
                {...register("githubToken")}
                placeholder="Github Token (Optional)"
                className="w-full text-xs"
              />
              <Button type="submit" className="mt-4">
                Create project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
