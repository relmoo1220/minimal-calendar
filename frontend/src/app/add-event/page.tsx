"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import InputText from "@/components/InputText/InputText";
import Button from "@/components/Button/Button";
import DateRange from "@/components/DateRange/DateRange";
import InputTime from "@/components/InputTime/InputTime";
import Dropdown from "@/components/Dropdown/Dropdown";

interface FormData {
  title: string;
  tag: string;
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

const AddEventPage = () => {
  const [tagItems, setTagItems] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tagItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };

    if (isTagDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagDropdownOpen]);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    tag: "",
    description: "",
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
  });

  const [eventItems, setEventItems] = useState<FormData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eventItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Track changes and update localStorage
  useEffect(() => {
    localStorage.setItem('eventItems', JSON.stringify(eventItems));
  }, [eventItems]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
  };

  const handleInputChange =
    (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setEventItems(prev => [...prev, formData]);
      router.push('/');
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.tag.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.startDate !== null &&
      formData.endDate !== null &&
      formData.startTime !== "" &&
      formData.endTime !== ""
    );
  };

  const router = useRouter();

  return (
    <div className="min-h-screen m-4 sm:m-8">
      <Button
        onClick={() => router.push("/")}
        className="mb-6 hover:bg-gray-300"
      >
        <ChevronLeftIcon className="w-5 h-5 text-background" />
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          Add New Event
        </h1>
        <form onSubmit={handleSubmit}>
          <Dropdown
            ref={dropdownRef}
            label="Tag"
            items={tagItems}
            value={formData.tag}
            isOpen={isTagDropdownOpen}
            onOpenChange={setIsTagDropdownOpen}
            onSelect={(tag: TagItem) => {
              setFormData(prev => ({
                ...prev,
                tag: tag.name
              }));
            }}
            placeholder="Select a tag"
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
          <InputText
            label="Title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={handleInputChange("title")}
          />
          
          <InputText
            label="Description"
            placeholder="Enter event description"
            value={formData.description}
            onChange={handleInputChange("description")}
          />
          <div className="grid grid-cols-1 gap-4">
            <DateRange
              label="Date Range"
              startDate={formData.startDate}
              endDate={formData.endDate}
              onDateChange={handleDateChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputTime
              label="Start Time"
              value={formData.startTime}
              onChange={handleInputChange("startTime")}
            />
            <InputTime
              label="End Time"
              value={formData.endTime}
              onChange={handleInputChange("endTime")}
            />
          </div>
          <Button
            onClick={(e) => handleSubmit(e as FormEvent)}
            disabled={!isFormValid()}
            variant="light"
            className="w-full mt-8"
          >
            Add Event
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
