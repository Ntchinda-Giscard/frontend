"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FieldPairComponent } from "@/components/field-pair";
import { useFormStore } from "@/lib/email-site";
import { validateFieldPair } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { fetchInitialConfig, submitFormData } from "@/app/action";

export default function Home() {
  const {
    fields,
    addFieldPair,
    removeFieldPair,
    updateFieldPair,
    resetForm,
    setFields,
    isLoading,
    setIsLoading,
  } = useFormStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const result = await fetchInitialConfig();

      if (
        result.success &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        const initialFields = result.data.map((item: any, index: number) => ({
          id: (index + 1).toString(),
          site: item.site,
          email_address: item.email_address,
        }));
        setFields(initialFields);
      }

      if (!result.success) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données initiales.",
          variant: "destructive",
        });
      }

      setIsLoading(false);
    };

    loadInitialData();
  }, [setIsLoading, setFields, toast]);

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
      email_config: field.email_address,
    }));

    setIsSubmitting(true);
    const result = await submitFormData(payload);

    if (result.success) {
      toast({
        title: "Succès!",
        description: "Vos données ont été enregistrées avec succès.",
        variant: "default",
      });
      resetForm();
    } else {
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement. Veuillez réessayer.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                  <p className="text-muted-foreground mt-2">
                    Chargement des données...
                  </p>
                </div>
              </div>
            ) : (
              <>
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
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </>
            )}
          </div>

          {/* Info Text */}
          {!isLoading && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Champs: {fields.length} • Validation: Format email + noms de
                site d'au moins 2 caractères
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
