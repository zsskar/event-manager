import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";

type props = {
  eventId: number;
  deleteEvent: (eventId: number) => void;
};

export default function DeleteEventButton({ eventId, deleteEvent }: props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const confirmDelete = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const okDeleteTheEvent = () => {
    deleteEvent(eventId);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <Button
          onClick={confirmDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-200"
        >
          <TrashIcon className="w-5 h-5" />
          Delete
        </Button>
      </div>
      <DeleteConfirmation
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        okDelete={okDeleteTheEvent}
      />
    </>
  );
}
