import {
  Circle,
  CircleCheckBig,
  Edit,
  LoaderPinwheel,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { cn } from "@/shared/lib/utils";

type EditableCardProps<T> = {
  data: T;
  editMode: boolean;
  EditTitle: string;
  onEditTitleChange: (value: string) => void;
  onUpdate: () => void;
  onEdit: () => void;
  onCloseEdit: () => void;
  onDelete: () => void;
  isUpdatePending: boolean;
  selected?: boolean;
  onSelect?: (data: T) => void;
};

export function EditableCard<T extends UIItem>({
  data,
  editMode,
  EditTitle,
  onEditTitleChange,
  onUpdate,
  onEdit,
  onCloseEdit,
  onDelete,
  isUpdatePending,
  selected,
  onSelect,
}: EditableCardProps<T>) {
  return (
    <Card className="flex items-center justify-between">
      <CardHeader className="grow">
        <CardTitle className="flex space-x-2">
          {editMode ? (
            <>
              <Input
                placeholder="Edit name"
                value={EditTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
              />
              <Button variant="outline" onClick={onCloseEdit}>
                <X size={16} />
              </Button>
            </>
          ) : (
            data.title
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-end space-x-2">
          {editMode ? (
            <Button onClick={onUpdate} disabled={!EditTitle || isUpdatePending}>
              {isUpdatePending ? (
                <LoaderPinwheel
                  size={16}
                  className={cn({ "animate-spin": isUpdatePending })}
                />
              ) : (
                <Save size={16} />
              )}
            </Button>
          ) : (
            <Button onClick={onEdit}>
              <Edit size={16} />
            </Button>
          )}
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
          {onSelect && (
            <Button variant="outline" onClick={() => onSelect(data)}>
              {selected ? <CircleCheckBig size={16} /> : <Circle size={16} />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
