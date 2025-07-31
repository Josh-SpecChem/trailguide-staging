"use client";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoginModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Sign In</DialogTitle>
        <form className="flex flex-col gap-3 mt-2" onSubmit={e => { e.preventDefault(); onOpenChange(false); }}>
          <Input
            type="email"
            autoFocus
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <Button type="submit">Log in</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}