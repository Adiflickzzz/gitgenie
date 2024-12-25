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

const AskQuestionCard = () => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState();
  const [loading, setLoading] = useState();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading;
    setOpen(true);

    const { output } = await askQuestion(question, project.id);
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
              onChange={(e) => e.target.value}
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
