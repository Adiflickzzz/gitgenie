import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import React, { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileReferences, setFileReferences] = useState<
    { filename?: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);

    const { output, fileRefrences } = await askQuestion(question, project.id);
    setFileReferences(fileRefrences);

    console.log(output);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }

    setLoading(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Image src="logo.svg" alt="GitGenie" width={32} height={32} />
            </DialogTitle>
          </DialogHeader>
          {answer}
          <h1>File Refernces</h1>
          {fileReferences.map((file) => {
            return <div>{file.filename}</div>;
          })}
        </DialogContent>
      </Dialog>
      <Card className="realtive col-span-3">
        <CardHeader>
          <CardTitle>Ask ai a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to chaneg the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit">Ask Gitgenie !</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
