import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const SettingsPanel = ({ appVersion }: { appVersion: string }) => {
  const {
    tempUnit,
    setTempUnit,
    timeFormat,
    setTimeFormat,
    showSeconds,
    setShowSeconds,
  } = useSettings();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
      <div className="text-lg text-muted-foreground/50 font-code">
        {appVersion}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configuración</SheetTitle>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label>Unidad de Temperatura</Label>
              <RadioGroup
                value={tempUnit}
                onValueChange={(value) => setTempUnit(value as any)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="celsius" />
                  <Label htmlFor="celsius">Celsius (°C)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="fahrenheit" />
                  <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label>Formato de Hora</Label>
              <RadioGroup
                value={timeFormat}
                onValueChange={(value) => setTimeFormat(value as any)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">24 Horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="12h" />
                  <Label htmlFor="12h">12 Horas (am/pm)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-seconds">Mostrar Segundos</Label>
              <Switch
                id="show-seconds"
                checked={showSeconds}
                onCheckedChange={setShowSeconds}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
