"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FieldPairComponent } from "@/components/field-pair";
import { useFormStore } from "@/lib/email-site";
import { validateFieldPair } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
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

    const payload = fields.map((field) => ({
      site: field.site,
      email_address: field.email_address,
    }));

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/config/add/address", {
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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Enregistrement Site & Email
            </h1>
            <p className="text-muted-foreground">
              Ajoutez plusieurs paires site et adresse email pour vous
              enregistrer
            </p>
          </div>

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

          {/* Info Text */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Champs: {fields.length} • Validation: Format email + noms de site
              d'au moins 2 caractères
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// smtp.gmail.com;
// txdp zcoh ucum ezxt
// ntchinda1998 @gmail.com
// giscardntchinda @gmail.com
// 587
