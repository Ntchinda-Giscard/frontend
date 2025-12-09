"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Plus } from "lucide-react";
import { FieldPairComponent } from "@/components/field-pair";
import { useFormStore } from "@/lib/email-site";
import { validateFieldPair } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function SiteEmailConfig() {
  const { fields, addFieldPair, removeFieldPair, updateFieldPair, resetForm } =
    useFormStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate all field pairs
    const validationErrors: Record<string, Record<string, string>> = {};
    let isFormValid = true;

    fields.forEach((field) => {
      const { isValid, errors } = validateFieldPair(
        field.site,
        field.email_address
      );
      if (!isValid) {
        validationErrors[field.id] = errors;
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      toast({
        title: "Erreur de validation",
        description:
          "Veuillez vérifier tous les champs et corriger les erreurs.",
        variant: "destructive",
      });
      return;
    }

    // Prepare data in the format [[field1, field2], ...]
    const payload = fields.map((field) => [field.site, field.email_address]);

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      toast({
        title: "Succès!",
        description: "Vos données ont été enregistrées avec succès.",
        variant: "default",
      });

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 mr-2" />
            Enregistrement Site & Email
          </CardTitle>
          <CardDescription>
            Ajoutez plusieurs paires site et adresse email pour vous enregistrer
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Form Container */}
          <div className="space-y-6">
            {/* Field Pairs List */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FieldPairComponent
                  key={field.id}
                  pair={field}
                  onUpdate={updateFieldPair}
                  onRemove={removeFieldPair}
                  isMultiple={fields.length > 1}
                />
              ))}
            </div>

            {/* Add Button */}
            <Button
              onClick={addFieldPair}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une paire
            </Button>

            {/* Register Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
