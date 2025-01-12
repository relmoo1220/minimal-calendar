"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import Calendar, { CalendarMode } from "@/components/Calendar/Calendar";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownInput from "@/components/DropdownInput/DropdownInput";

interface FormData {
  id: number;
  title: string;
  tag: {
    name: string;
    color: string;
  };
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
}

interface TagItem {
  name: string;
  color: string;
}

export default function Home() {
  const [selectedView, setSelectedView] = useState<CalendarMode>("Year");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tagItems, setTagItems] = useState<TagItem[]>([]);
  const [eventItems, setEventItems] = useState<FormData[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);

  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const tagInputDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load data after mount
  useEffect(() => {
    const savedTags = localStorage.getItem("tagItems");
    if (savedTags) {
      setTagItems(JSON.parse(savedTags));
    }

    const savedEvents = localStorage.getItem("eventItems");
    if (savedEvents) {
      setEventItems(JSON.parse(savedEvents));
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (tagItems.length > 0) {
      localStorage.setItem("tagItems", JSON.stringify(tagItems));
    }
  }, [tagItems]);

  useEffect(() => {
    if (eventItems.length > 0) {
      localStorage.setItem("eventItems", JSON.stringify(eventItems));
    }
  }, [eventItems]);

  const handleAddTag = (name: string, color: string) => {
    if (name.trim()) {
      setTagItems((prev) => {
        const exists = prev.some((tag) => tag.name === name.trim());
        if (!exists) {
          return [...prev, { name: name.trim(), color }];
        }
        return prev;
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagItems((prev) => prev.filter((tag) => tag.name !== tagToRemove));
  };

  const handleViewChange = (newMode: CalendarMode, date: Date) => {
    setSelectedView(newMode);
    setSelectedDate(date);
  };

  const calendarView: CalendarMode[] = ["Year", "Month", "Week", "Day"];

  const formattedEvents = eventItems.map((event, index) => ({
    id: index,
    title: event.title,
    tag: event.tag, // Already in correct format {name, color}
    description: event.description,
    startDate: new Date(event.startDate!),
    endDate: new Date(event.endDate!),
    startTime: event.startTime,
    endTime: event.endTime,
  }));

  return (
    <div className="min-h-screen m-4 sm:m-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Minimal Calendar</h1>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <Button onClick={() => router.push("/add-event")}>Add Event</Button>
          <div className="relative" ref={tagInputDropdownRef}>
            <Button onClick={() => setIsTagInputOpen(!isTagInputOpen)}>
              Add Tag
            </Button>
            <DropdownInput
              onAddTag={handleAddTag}
              isOpen={isTagInputOpen}
              onClose={() => setIsTagInputOpen(false)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Dropdown
            ref={viewDropdownRef}
            items={calendarView}
            placeholder="Views"
            className="w-52"
            value={selectedView}
            isOpen={isViewDropdownOpen}
            onOpenChange={setIsViewDropdownOpen}
            onSelect={(value) => setSelectedView(value as CalendarMode)}
          />
          <Dropdown
            ref={tagDropdownRef}
            items={tagItems}
            placeholder="Tags"
            className="w-52"
            value={selectedTag || ""}
            isOpen={isTagDropdownOpen}
            onOpenChange={setIsTagDropdownOpen}
            onSelect={(tag) => setSelectedTag(tag.name)}
            enableRemove={true}
            onRemove={(tag) => handleRemoveTag(tag.name)}
            renderItem={(tag: TagItem) => (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span>{tag.name}</span>
              </div>
            )}
          />
        </div>
        <Calendar
          key={selectedView} // Add key to force re-render on view change
          mode={selectedView}
          selectedDate={selectedDate}
          events={formattedEvents}
          onViewChange={handleViewChange}
          className="mt-4"
        />
      </div>
    </div>
  );
}
