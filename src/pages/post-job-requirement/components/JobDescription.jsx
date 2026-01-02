import React, { useState } from "react";
import Button from "../../../components/ui/Button";

// 🆕 Simple Markdown → HTML converter (no external libs)
const convertMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **Bold**
    .replace(/(?:\r\n|\r|\n)/g, "<br>") // new lines
    .replace(/• /g, "•&nbsp;"); // bullet clean spacing only
};

const JobDescription = ({ formData, onChange, errors }) => {
  const [activeTab, setActiveTab] = useState("description");
  const maxChars = 2000;

  const applyFormatting = (formatter) => {
    const textarea = document.getElementById("job-description");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.description.substring(start, end);

    const newText = formatter(formData.description, selected, start, end);
    onChange("description", newText);

    // Keep cursor inside formatted area
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  const boldText = () =>
    applyFormatting((text, selected, start, end) =>
      text.substring(0, start) +
      `**${selected || "bold text"}**` +
      text.substring(end)
    );

  const addBullet = () =>
    applyFormatting((text, selected, start, end) =>
      text.substring(0, start) +
      `\n• ${selected || "Task"}` +
      text.substring(end)
    );

  const addNumber = () =>
    applyFormatting((text, selected, start, end) =>
      text.substring(0, start) +
      `\n1. ${selected || "Item"}` +
      text.substring(end)
    );

  const insertTemplate = (type) => {
    const templates = {
      responsibilities: "\n**Key Responsibilities:**\n• Task #1\n• Task #2\n• Task #3\n",
      requirements: "\n**Requirements:**\n• Requirement #1\n• Requirement #2\n• Requirement #3\n",
      benefits: "\n**Benefits:**\n• Benefit #1\n• Benefit #2\n• Benefit #3\n",
    };
    onChange("description", formData.description + templates[type]);
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">2</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Job Description</h2>
          <p className="text-sm text-muted-foreground">
            Detailed information about the role
          </p>
        </div>
      </div>

      {/* Switch Tabs */}
      <div className="flex gap-2 border-b border-border">
        {["description", "preview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "description" ? "Description" : "Preview"}
          </button>
        ))}
      </div>

      {activeTab === "description" ? (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
            <Button variant="ghost" size="sm" iconName="Bold" onClick={boldText}>
              Bold
            </Button>
            <Button variant="ghost" size="sm" iconName="List" onClick={addBullet}>
              Bullet
            </Button>
            <Button variant="ghost" size="sm" iconName="ListOrdered" onClick={addNumber}>
              Number
            </Button>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => insertTemplate("responsibilities")}>
                + Responsibilities
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("requirements")}>
                + Requirements
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("benefits")}>
                + Benefits
              </Button>
            </div>
          </div>

          {/* Main Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Job Description <span className="text-destructive">*</span>
            </label>

            <textarea
              id="job-description"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Describe the job responsibilities, requirements, working conditions, and any other relevant details..."
              className="w-full min-h-[300px] p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              maxLength={maxChars}
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Supports **bold**, bullets (•), numbering (1.)</span>
              <span>{formData.description.length}/{maxChars} characters</span>
            </div>

            {errors?.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none p-6 bg-muted rounded-lg min-h-[300px]">
          {formData.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: convertMarkdown(formData.description),
              }}
            />
          ) : (
            <p className="text-muted-foreground italic">
              No description added yet. Switch to Description tab to add content.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDescription;
