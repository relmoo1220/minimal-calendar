"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import Calendar, { CalendarMode } from "@/components/Calendar/Calendar";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownInput from "@/components/DropdownInput/DropdownInput";

export default function Home() {
  const [selectedView, setSelectedView] = useState<CalendarMode>("Year");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventItems, setEventItems] = useState([
    "Meeting",
    "Interview",
    "Appointment",
  ]);

  // Normal Dropdown
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Tag Input Dropdown
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const tagInputDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        viewDropdownRef.current &&
        !viewDropdownRef.current.contains(event.target as Node)
      ) {
        setIsViewDropdownOpen(false);
      }
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
      if (
        tagInputDropdownRef.current &&
        !tagInputDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagInputOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = (value: string) => {
    if (value.trim()) {
      setEventItems((prev) => [...prev, value.trim()]);
    }
  };

  const handleViewChange = (newMode: CalendarMode, date: Date) => {
    setSelectedView(newMode);
    setSelectedDate(date);
  };

  const router = useRouter();

  const calendarView: CalendarMode[] = ["Year", "Month", "Week", "Day"];

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
            onSelect={(value) => setSelectedView(value as CalendarMode)}
            value={selectedView}
            isOpen={isViewDropdownOpen}
            onOpenChange={setIsViewDropdownOpen}
          />
          <Dropdown
            ref={tagDropdownRef}
            items={eventItems}
            placeholder="Tags"
            className="w-52"
            isOpen={isTagDropdownOpen}
            onOpenChange={setIsTagDropdownOpen}
          />
        </div>
        <div className="flex w-full h-full">
          <Calendar
            mode={selectedView}
            selectedDate={selectedDate}
            onViewChange={handleViewChange}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
