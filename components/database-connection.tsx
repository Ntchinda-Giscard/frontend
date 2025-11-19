"use client";

import { useEffect } from "react";
import { useConnectionStore } from "@/lib/database-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DatabaseConnectionForm() {
  const {
    connectionType,
    odbcConnection,
    sqlConnection,
    odbcSources,
    isLoading,
    isSaving,
    setConnectionType,
    updateODBCField,
    updateSQLField,
    getOdbcSources,
    loadExistingConnection,
    saveConnection,
  } = useConnectionStore();

  const { toast } = useToast();

  // Load ODBC sources and existing connection on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getOdbcSources(), loadExistingConnection()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [getOdbcSources, loadExistingConnection]);

  const handleSave = async () => {
    try {
      await saveConnection();
      toast({
        title: "Paramètres enregistrés",
        description: "Paramètres enregistrée avec succès !",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Veuillez remplir tous les champ.";
      toast({
        title: "Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" /> Connexion à la base de données
        </CardTitle>
        <CardDescription>
          Configurez les paramètres de connexion à votre base de données
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Type de connexion</Label>
          <RadioGroup
            value={connectionType}
            onValueChange={(value) =>
              setConnectionType(value as "odbc" | "sql")
            }
            disabled={isLoading}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sql" id="sql" />
              <Label htmlFor="sql" className="font-normal cursor-pointer">
                Connexion SQL
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="odbc" id="odbc" />
              <Label htmlFor="odbc" className="font-normal cursor-pointer">
                Source ODBC
              </Label>
            </div>
          </RadioGroup>
        </div>

        {connectionType === "sql" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host">Hôte</Label>
              <Input
                id="host"
                placeholder="localhost"
                value={sqlConnection.host}
                onChange={(e) => updateSQLField("host", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="5432"
                value={sqlConnection.port}
                onChange={(e) => updateSQLField("port", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Base de données</Label>
              <Input
                id="database"
                placeholder="mabase"
                value={sqlConnection.database}
                onChange={(e) => updateSQLField("database", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sql-username">Nom d'utilisateur</Label>
              <Input
                id="sql-username"
                placeholder="admin"
                value={sqlConnection.username}
                onChange={(e) => updateSQLField("username", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sql-password">Mot de passe</Label>
              <Input
                id="sql-password"
                type="password"
                placeholder="••••••••"
                value={sqlConnection.password}
                onChange={(e) => updateSQLField("password", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dsn">Nom DSN</Label>
              <Select
                value={odbcConnection.dsnName}
                onValueChange={(value) => updateODBCField("dsnName", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="dsn">
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "Chargement..."
                        : odbcSources.length > 0
                        ? "Sélectionnez un DSN"
                        : "Aucune source ODBC disponible"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {odbcSources.map((source) => (
                    <SelectItem key={source.name} value={source.name}>
                      {source.name} ({source.description})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="odbc-database">Base de données</Label>
              <Input
                id="odbc-database"
                placeholder="sage_x3"
                value={odbcConnection.database}
                onChange={(e) => updateODBCField("database", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odbc-username">Nom d'utilisateur</Label>
              <Input
                id="odbc-username"
                placeholder="admin"
                value={odbcConnection.username}
                onChange={(e) => updateODBCField("username", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odbc-password">Mot de passe</Label>
              <Input
                id="odbc-password"
                type="password"
                placeholder="••••••••"
                value={odbcConnection.password}
                onChange={(e) => updateODBCField("password", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full mt-4"
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer la connexion"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
