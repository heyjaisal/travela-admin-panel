import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function HomepageEditor() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null);
  const [type, setType] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/admin/homepage");
      setData(res.data);
    } catch (error) {
      toast.error("Failed to fetch homepage data.");
    }
  };

  const openEditor = (item, itemType) => {
    setEditing(item);
    setType(itemType);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (type === "testimonial" && ["fullName", "picture", "designation"].includes(name)) {
      setEditing((prev) => ({
        ...prev,
        author: { ...prev.author, [name]: value },
      }));
    } else {
      setEditing((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const requiredFields = {
      card: ["title", "subtitle", "image", "span", "route"],
      faq: ["question", "answer"],
      testimonial: ["fullName", "picture", "designation", "description"],
    }[type];

    const isValid = requiredFields.every((field) => {
      if (type === "testimonial" && ["fullName", "picture", "designation"].includes(field)) {
        return editing.author?.[field]?.trim();
      }
      return editing[field]?.trim();
    });

    if (!isValid) {
      toast.error("Please fill in all fields.");
      return;
    }

    const payload =
      type === "testimonial"
        ? { ...editing, ...editing.author }
        : editing;

    try {
      await axiosInstance.put(`/admin/homepage/${type}/${editing._id}`, payload);
      toast.success("Updated successfully.");
      setOpen(false);
      fetchData();
    } catch {
      toast.error("Update failed.");
    }
  };

  const Field = ({ label, name, type = "text", value }) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      {type === "textarea" ? (
        <Textarea name={name} value={value} onChange={handleChange} />
      ) : (
        <Input name={name} value={value} onChange={handleChange} />
      )}
    </div>
  );

  const EditForm = () => {
    if (!editing || !type) return null;

    return (
      <div className="space-y-4">
        {type === "card" && (
          <>
            <Field label="Title" name="title" value={editing.title} />
            <Field label="Subtitle" name="subtitle" value={editing.subtitle} />
            <Field label="Image URL" name="image" value={editing.image} />
            <Field label="Span" name="span" value={editing.span} />
            <Field label="Route" name="route" value={editing.route} />
          </>
        )}
        {type === "faq" && (
          <>
            <Field label="Question" name="question" value={editing.question} />
            <Field label="Answer" name="answer" type="textarea" value={editing.answer} />
          </>
        )}
        {type === "testimonial" && (
          <>
            <Field label="Full Name" name="fullName" value={editing.author?.fullName} />
            <Field label="Designation" name="designation" value={editing.author?.designation} />
            <Field label="Picture URL" name="picture" value={editing.author?.picture} />
            <Field label="Description" name="description" type="textarea" value={editing.description} />
          </>
        )}
      </div>
    );
  };

  const ItemCard = ({ item, type }) => (
    <div className="border p-4 rounded-2xl shadow-sm">
      <h4 className="font-semibold mb-1">
        {type === "testimonial" ? item.author.fullName : item.title || item.question}
      </h4>
      <p className="text-muted-foreground text-sm">
        {type === "testimonial" ? item.description : item.subtitle || item.answer}
      </p>
      <Button className="mt-2" size="sm" onClick={() => openEditor(item, type)}>
        Edit
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/home")}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <h2 className="text-2xl font-bold mt-4">Edit Homepage Content</h2>

      {data && (
        <>
          {["cardItems", "faqList", "testimonialList"].map((sectionKey) => {
            const items = data[sectionKey];
            const sectionType = sectionKey.includes("card")
              ? "card"
              : sectionKey.includes("faq")
              ? "faq"
              : "testimonial";
            const label =
              sectionType === "card"
                ? "Cards"
                : sectionType === "faq"
                ? "FAQs"
                : "Testimonials";

            return (
              <div key={sectionKey}>
                <h3 className="text-lg font-semibold mb-3">{label}</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {items.map((item) => (
                    <ItemCard key={item._id} item={item} type={sectionType} />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {type}</DialogTitle>
          </DialogHeader>
          <EditForm />
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
