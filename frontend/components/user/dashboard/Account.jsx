"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import formatDate from "@/lib/date";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Account({ data, mutate }) {
  const [mode, setMode] = useState("view");
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    setProfile(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and keep your profile up to date.
        </p>
      </div>

      {mode === "view" && <ViewMode profile={profile} setMode={setMode} />}
      {mode === "edit" && (
        <EditMode profile={profile} mutate={mutate} setMode={setMode} />
      )}
      {mode === "password" && (
        <ChangePasswordMode
          profile={profile}
          mutate={mutate}
          setMode={setMode}
        />
      )}
    </div>
  );
}

function ViewMode({ profile, setMode }) {
  return (
    <div className="flex flex-col gap-5 ">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-foreground">
            Full Name
          </dt>
          <dd className="text-sm">{profile.name}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
          <dd className="text-sm">{profile.email}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
          <dd className="text-sm">{profile.number}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-foreground">
            Date of Birth
          </dt>
          <dd className="text-sm">{formatDate(profile.dob)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-muted-foreground">
            Gender
          </dt>
          <dd className="text-sm capitalize">{profile.gender || "Not specified"}</dd>
        </div>
      </dl>
      <Separator />
      <div className="flex gap-2">
        <Button className="w-fit" onClick={() => setMode("edit")}>
          Edit Profile
        </Button>
        <Button
          className="w-fit"
          variant="outline"
          onClick={() => setMode("password")}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
}

function EditMode({ profile, mutate, setMode }) {
  const [formData, setFormData] = useState(profile);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(profile);
    setError("");
    setMode("view");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("asd");
    if (!formData.name || !formData.email) {
      setError("Name and Email are required");
      return;
    }

    try {
      const { data } = await api.patch(`/users/${profile.id}`, formData);
      toast.success(data.message);
      mutate();
      setMode("view");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <p className="text-sm text-muted-foreground">
        Update your details and save when you are ready.
      </p>

      <Separator className="my-5" />

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone</label>
          <input
            type="text"
            value={formData.number || ""}
            onChange={(e) => updateField("number", e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* DOB */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Date of Birth</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !formData.dob && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dob ? (
                  format(new Date(formData.dob), "yyyy-MM-dd")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dob ? new Date(formData.dob) : undefined}
                onSelect={(date) =>
                  updateField("dob", date ? date.toISOString() : "")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Gender</label>
          <select
            value={formData.gender || ""}
            onChange={(e) => updateField("gender", e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      <div className="mt-5 flex gap-3">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ChangePasswordMode({ profile, mutate, setMode }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMode("view");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      setError("Password and Confirm Password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.patch(`/users/${profile.id}`, { password });
      toast.success(response.data?.message || "Password updated successfully");
      setPassword("");
      setConfirmPassword("");
      setError("");
      mutate();
      setMode("view");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground">
        Create a new password for your account.
      </p>

      <Separator className="my-5" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      <div className="mt-5 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
