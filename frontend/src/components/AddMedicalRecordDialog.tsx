import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type MedicalRecord = {
  date: string;
  condition: string;
  treatment: string;
  notes: string;
};

type AddMedicalRecordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (record: MedicalRecord) => void;
};

export default function AddMedicalRecordDialog({
  open,
  onOpenChange,
  onAdd,
}: AddMedicalRecordDialogProps) {
  const [newRecord, setNewRecord] = useState<MedicalRecord>({
    date: "",
    condition: "",
    treatment: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newRecord);
    setNewRecord({ date: "", condition: "", treatment: "", notes: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Medical Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newRecord.date}
              onChange={(e) =>
                setNewRecord({ ...newRecord, date: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              value={newRecord.condition}
              onChange={(e) =>
                setNewRecord({ ...newRecord, condition: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment</Label>
            <Input
              id="treatment"
              value={newRecord.treatment}
              onChange={(e) =>
                setNewRecord({ ...newRecord, treatment: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newRecord.notes}
              onChange={(e) =>
                setNewRecord({ ...newRecord, notes: e.target.value })
              }
            />
          </div>
          <Button type="submit">Add Record</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
