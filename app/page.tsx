"use client";

import { FolderPicker } from "@/components/folder-picker";
import { ServiceControls } from "@/components/service-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Database, FolderInput, FolderOutput, Save } from "lucide-react";
import { useFolderStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseConnectionForm } from "@/components/database-connection";

export default function FolderPickerPage() {
  const {
    inputFolder,
    outputFolder,
    setInputFolder,
    setOutputFolder,
    saveSettings,
  } = useFolderStore();

  const { toast } = useToast();

  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      toast({
        title: "Paramètres enregistrés",
        description:
          "Votre configuration de dossiers a été enregistrée avec succès.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Veuillez remplir tous les chemins de dossiers avant d'enregistrer.";

      toast({
        title: "Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Configuration du traitement de fichiers
          </h1>
          <p className="text-muted-foreground">
            Configurez les dossiers d'entrée et de sortie pour le traitement
          </p>
        </div>

        <div className="space-y-4">
          <ServiceControls />
          <Tabs defaultValue="dossier" className="w-full space-y-4">
            <TabsList>
              <TabsTrigger value="database"> Base de donnée</TabsTrigger>
              <TabsTrigger value="dossier"> Dossier </TabsTrigger>
              <TabsTrigger value="email">Configuration SMTP</TabsTrigger>
            </TabsList>

            <TabsContent value="dossier">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderInput className="h-5 w-5" />
                    Dossier principal (Avant traitement)
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez le dossier contenant les fichiers à traiter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FolderPicker
                    value={inputFolder}
                    onChange={setInputFolder}
                    placeholder="Sélectionner le dossier d'entrée..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOutput className="h-5 w-5" />
                    Dossier de sortie (Après traitement)
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez le dossier où les fichiers traités seront
                    enregistrés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FolderPicker
                    value={outputFolder}
                    onChange={setOutputFolder}
                    placeholder="Sélectionner le dossier de sortie..."
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer la configuration
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="database">
              <DatabaseConnectionForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
