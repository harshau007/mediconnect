import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddMedicalRecordDialog from "./AddMedicalRecordDialog";
import { Button } from "./ui/button";

interface MedicalRecord {
  id: number;
  date: string;
  condition: string;
  treatment: string;
  notes: string;
}

export default function MedicalHistory() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [open, setOpen] = useState(false);

  const addRecord = (newRecord: Omit<MedicalRecord, "id">) => {
    setRecords([...records, { ...newRecord, id: Date.now() }]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medical History</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </div>
      <AddMedicalRecordDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={addRecord}
      />
      <div className="space-y-4">
        {records.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <CardTitle>{record.condition}</CardTitle>
              <CardDescription>{record.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Treatment:</strong> {record.treatment}
              </p>
              <p>
                <strong>Notes:</strong> {record.notes}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
