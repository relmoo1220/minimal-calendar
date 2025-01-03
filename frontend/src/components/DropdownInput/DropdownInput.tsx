import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "../Button/Button";
import InputText from "../InputText/InputText";

interface DropdownInputProps {
  onAddTag: (tag: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DropdownInput = ({ onAddTag, isOpen, onClose }: DropdownInputProps) => {
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewTag("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (newTag.trim()) {
      onAddTag(newTag);
      setNewTag("");
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 w-96 z-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="m-4 flex gap-2 bg-foreground p-4 rounded-lg shadow-lg"
          >
            <InputText
              className="flex-1"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter new tag"
            />
            <Button
              onClick={handleSubmit}
              disabled={!newTag.trim()}
              variant="dark"
            >
              Add
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownInput;
