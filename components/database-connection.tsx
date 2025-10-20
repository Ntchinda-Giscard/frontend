"use client";

import { useState } from "react";
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
import { Database } from "lucide-react";

export function DatabaseConnectionForm() {
  const {
    connectionType,
    odbcConnection,
    sqlConnection,
    setConnectionType,
    setODBCConnection,
    setSQLConnection,
  } = useConnectionStore();

  const [odbcForm, setOdbcForm] = useState(odbcConnection);
  const [sqlForm, setSqlForm] = useState(sqlConnection);

  const dsnOptions = [
    "MyDataSource",
    "ProductionDB",
    "DevelopmentDB",
    "TestDB",
    "AnalyticsDB",
  ];

  const handleSave = () => {
    if (connectionType === "odbc") {
      setODBCConnection(odbcForm);
      alert("Connexion ODBC enregistrée !");
    } else {
      setSQLConnection(sqlForm);
      alert("Connexion SQL enregistrée !");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {" "}
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
                value={sqlForm.host}
                onChange={(e) =>
                  setSqlForm({ ...sqlForm, host: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="5432"
                value={sqlForm.port}
                onChange={(e) =>
                  setSqlForm({ ...sqlForm, port: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Base de données</Label>
              <Input
                id="database"
                placeholder="mabase"
                value={sqlForm.database}
                onChange={(e) =>
                  setSqlForm({ ...sqlForm, database: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sql-username">Nom d'utilisateur</Label>
              <Input
                id="sql-username"
                placeholder="admin"
                value={sqlForm.username}
                onChange={(e) =>
                  setSqlForm({ ...sqlForm, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sql-password">Mot de passe</Label>
              <Input
                id="sql-password"
                type="password"
                placeholder="••••••••"
                value={sqlForm.password}
                onChange={(e) =>
                  setSqlForm({ ...sqlForm, password: e.target.value })
                }
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dsn">Nom DSN</Label>
              <Select
                value={odbcForm.dsnName}
                onValueChange={(value) =>
                  setOdbcForm({ ...odbcForm, dsnName: value })
                }
              >
                <SelectTrigger id="dsn">
                  <SelectValue placeholder="Sélectionnez un DSN" />
                </SelectTrigger>
                <SelectContent>
                  {dsnOptions.map((dsn) => (
                    <SelectItem key={dsn} value={dsn}>
                      {dsn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="odbc-username">Nom d'utilisateur</Label>
              <Input
                id="odbc-username"
                placeholder="admin"
                value={odbcForm.username}
                onChange={(e) =>
                  setOdbcForm({ ...odbcForm, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odbc-password">Mot de passe</Label>
              <Input
                id="odbc-password"
                type="password"
                placeholder="••••••••"
                value={odbcForm.password}
                onChange={(e) =>
                  setOdbcForm({ ...odbcForm, password: e.target.value })
                }
              />
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Enregistrer la connexion
        </Button>
      </CardContent>
    </Card>
  );
}
