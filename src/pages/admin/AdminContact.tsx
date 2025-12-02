import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface ContactInfo {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  map_lat: number | null;
  map_lng: number | null;
  working_hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const AdminContact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ContactInfo>>({});

  const { data: contactInfo, isLoading } = useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .single();
      
      if (error) throw error;
      return {
        ...data,
        working_hours: data.working_hours as ContactInfo["working_hours"],
        social_links: data.social_links as ContactInfo["social_links"],
      } as ContactInfo;
    },
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingHoursChange = (day: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      working_hours: {
        ...(prev.working_hours as ContactInfo["working_hours"]),
        [day]: value,
      },
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...(prev.social_links as ContactInfo["social_links"]),
        [platform]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!contactInfo?.id) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("contact_info")
        .update({
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          map_lat: formData.map_lat,
          map_lng: formData.map_lng,
          working_hours: formData.working_hours,
          social_links: formData.social_links,
        })
        .eq("id", contactInfo.id);

      if (error) throw error;

      toast({
        title: "Contact info saved",
        description: "Contact information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Update your contact information
        </p>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Contact Details */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Contact Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+254114107570"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp || ""}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="+254114107570"
              className="mt-2"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@furnitureco.com"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Industrial Area"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Nairobi"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="Kenya"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="map_lat">Map Latitude</Label>
            <Input
              id="map_lat"
              type="number"
              step="0.0001"
              value={formData.map_lat || ""}
              onChange={(e) => handleChange("map_lat", parseFloat(e.target.value))}
              placeholder="-1.2921"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="map_lng">Map Longitude</Label>
            <Input
              id="map_lng"
              type="number"
              step="0.0001"
              value={formData.map_lng || ""}
              onChange={(e) => handleChange("map_lng", parseFloat(e.target.value))}
              placeholder="36.8219"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Working Hours</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="weekdays">Weekdays</Label>
            <Input
              id="weekdays"
              value={(formData.working_hours as ContactInfo["working_hours"])?.weekdays || ""}
              onChange={(e) => handleWorkingHoursChange("weekdays", e.target.value)}
              placeholder="9:00 AM - 6:00 PM"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="saturday">Saturday</Label>
            <Input
              id="saturday"
              value={(formData.working_hours as ContactInfo["working_hours"])?.saturday || ""}
              onChange={(e) => handleWorkingHoursChange("saturday", e.target.value)}
              placeholder="10:00 AM - 4:00 PM"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="sunday">Sunday</Label>
            <Input
              id="sunday"
              value={(formData.working_hours as ContactInfo["working_hours"])?.sunday || ""}
              onChange={(e) => handleWorkingHoursChange("sunday", e.target.value)}
              placeholder="Closed"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Social Media Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={(formData.social_links as ContactInfo["social_links"])?.facebook || ""}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={(formData.social_links as ContactInfo["social_links"])?.instagram || ""}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              value={(formData.social_links as ContactInfo["social_links"])?.twitter || ""}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              placeholder="https://twitter.com/..."
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
