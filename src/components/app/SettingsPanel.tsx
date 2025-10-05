/**
 * SettingsPanel Component
 *
 * Provides a slide-out panel for user configuration options.
 * Displays the app version alongside the settings icon in the top-right corner.
 * Contains controls for:
 * - Temperature unit (Celsius/Fahrenheit)
 * - Time format (12h/24h)
 * - Seconds display toggle
 * - Weather data refresh interval
 * - Version update check interval
 */

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Menu } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { trackUserInteraction } from '@/lib/analytics';

/**
 * SettingsPanel - Configuration panel component
 * @param appVersion - The current application version string to display
 */
export const SettingsPanel = ({ appVersion }: { appVersion: string }) => {
  // Extract settings state and setters from context
  const {
    // Date settings
    dateSeparator,
    setDateSeparator,
    dayFormat,
    setDayFormat,
    monthFormat,
    setMonthFormat,
    yearFormat,
    setYearFormat,
    // Time settings
    timeFormat,
    setTimeFormat,
    showSeconds,
    setShowSeconds,
    blinkingColons,
    setBlinkingColons,
    // Weather settings
    tempUnit,
    setTempUnit,
    refreshInterval,
    setRefreshInterval,
    // General settings
    theme,
    setTheme,
  } = useSettings();

  // Track settings panel open
  const handleSettingsOpen = () => {
    trackUserInteraction.settingsPanelOpen();
  };

  return (
    // Settings panel trigger button
    <Sheet>
      <SheetTrigger asChild>
        <button
          onClick={handleSettingsOpen}
          className="text-muted-foreground hover:text-foreground transition-colors bg-white/20 rounded-full p-2 flex items-center gap-2"
          aria-label="Settings"
          title="Settings"
        >
          <span className="text-sm">{appVersion}</span>
          <Menu className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configuración</SheetTitle>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          {/* Fecha (Date) Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Fecha
            </h3>
            <div className="grid gap-3">
              <Label>Separador de Fecha</Label>
              <RadioGroup
                value={dateSeparator}
                onValueChange={(value) => {
                  setDateSeparator(value as any);
                  trackUserInteraction.dateSeparatorChange(value as any);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="space" />
                  <Label htmlFor="space">Espacio (por defecto)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dot" id="dot" />
                  <Label htmlFor="dot">Punto (.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="slash" id="slash" />
                  <Label htmlFor="slash">Barra (/)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dash" id="dash" />
                  <Label htmlFor="dash">Guion (-)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label>Formato del Día</Label>
              <RadioGroup
                value={dayFormat}
                onValueChange={(value) => {
                  setDayFormat(value as any);
                  trackUserInteraction.dayFormatChange(value as any);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full-day" />
                  <Label htmlFor="full-day">Completo (por defecto)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short-day" />
                  <Label htmlFor="short-day">Abreviado</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label>Formato del Mes</Label>
              <RadioGroup
                value={monthFormat}
                onValueChange={(value) => {
                  setMonthFormat(value as any);
                  trackUserInteraction.monthFormatChange(value as any);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Completo (por defecto)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Abreviado</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label>Formato del Año</Label>
              <RadioGroup
                value={yearFormat}
                onValueChange={(value) => {
                  setYearFormat(value as any);
                  // Note: No specific tracking for year format yet
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full-year" />
                  <Label htmlFor="full-year">Completo (por defecto)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short-year" />
                  <Label htmlFor="short-year">Abreviado (2 caracteres)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border/50 my-4"></div>

          {/* Hora (Time) Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Hora
            </h3>
            <div className="grid gap-3">
              <Label>Formato de Hora</Label>
              <RadioGroup
                value={timeFormat}
                onValueChange={(value) => {
                  setTimeFormat(value as any);
                  // Auto-manage seconds based on format
                  if (value === '24h') {
                    setShowSeconds(true);
                  } else if (value === '12h') {
                    setShowSeconds(false);
                  }
                  trackUserInteraction.timeFormatChange(value as '12h' | '24h');
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">24 Horas (por defecto)</Label>
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
                disabled={timeFormat === '12h'} // Disable when 12h format is selected
                onCheckedChange={(checked) => {
                  setShowSeconds(checked);
                  trackUserInteraction.secondsToggle(checked);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="blinking-colons">Separadores Parpadeantes</Label>
              <Switch
                id="blinking-colons"
                checked={blinkingColons}
                onCheckedChange={(checked) => {
                  setBlinkingColons(checked);
                  trackUserInteraction.blinkingColonsToggle(checked);
                }}
              />
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border/50 my-4"></div>

          {/* Clima (Weather) Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Clima
            </h3>
            <div className="grid gap-3">
              <Label>Unidad de Temperatura</Label>
              <RadioGroup
                value={tempUnit}
                onValueChange={(value) => {
                  setTempUnit(value as any);
                  trackUserInteraction.temperatureUnitChange(
                    value as 'C' | 'F'
                  );
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="celsius" />
                  <Label htmlFor="celsius">Celsius (°C) (por defecto)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="fahrenheit" />
                  <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label>Intervalo de Actualización</Label>
              <Select
                value={String(refreshInterval)}
                onValueChange={(value) => {
                  const numValue = Number(value);
                  setRefreshInterval(numValue);
                  trackUserInteraction.refreshIntervalChange(numValue);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar intervalo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cada 1 minuto (por defecto)</SelectItem>
                  <SelectItem value="5">Cada 5 minutos</SelectItem>
                  <SelectItem value="10">Cada 10 minutos</SelectItem>
                  <SelectItem value="15">Cada 15 minutos</SelectItem>
                  <SelectItem value="30">Cada 30 minutos</SelectItem>
                  <SelectItem value="0">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border/50 my-4"></div>

          {/* General Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              General
            </h3>
            <div className="grid gap-3">
              <Label>Modo de Tema</Label>
              <RadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value as any);
                  trackUserInteraction.themeChange(value as any);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Oscuro (por defecto)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Claro</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
