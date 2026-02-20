import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Props {
  currentGoal: number;
  onUpdate: (minutes: number) => Promise<void>;
}

const GoalSetting = ({ currentGoal, onUpdate }: Props) => {
  const [value, setValue] = useState(currentGoal);

  const hours = (value / 60).toFixed(1);

  const handleSave = async () => {
    await onUpdate(value);
    toast.success(`Daily goal updated to ${hours} hours`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Daily Goal</h3>
      </div>
      <div className="text-3xl font-display font-bold mb-4">{hours} <span className="text-base text-muted-foreground font-normal">hours/day</span></div>
      <Slider
        value={[value]}
        onValueChange={([v]) => setValue(v)}
        min={30}
        max={720}
        step={30}
        className="mb-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground mb-4">
        <span>30min</span>
        <span>12h</span>
      </div>
      {value !== currentGoal && (
        <Button onClick={handleSave} size="sm" className="gradient-warm-bg text-primary-foreground">
          Save Goal
        </Button>
      )}
    </motion.div>
  );
};

export default GoalSetting;
