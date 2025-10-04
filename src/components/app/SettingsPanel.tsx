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
import { Settings, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { trackUserInteraction } from '@/lib/analytics';
import {
  useVersionCheck,
  getVersionStatusMessage,
} from '@/hooks/useVersionCheck';
import { useToast } from '@/hooks/use-toast';

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
    abbreviateDay,
    setAbbreviateDay,
    monthFormat,
    setMonthFormat,
    // Time settings
    timeFormat,
    setTimeFormat,
    showSeconds,
    setShowSeconds,
    // Weather settings
    tempUnit,
    setTempUnit,
    refreshInterval,
    setRefreshInterval,
    // General settings
    theme,
    setTheme,
    updateCheckInterval,
    setUpdateCheckInterval,
  } = useSettings();

  // Version checking hook with dynamic interval (convert minutes to milliseconds)
  const versionCheck = useVersionCheck(updateCheckInterval * 60 * 1000);
  const { toast } = useToast();

  // Track settings panel open
  const handleSettingsOpen = () => {
    trackUserInteraction.settingsPanelOpen();
  };

  // Show update notification when update is detected
  React.useEffect(() => {
    if (versionCheck.hasUpdate && versionCheck.latestVersion) {
      toast({
        title: 'Actualización disponible',
        description: `Nueva versión ${versionCheck.latestVersion} disponible. Actualiza la página para obtener las últimas mejoras.`,
        duration: 10000, // 10 seconds
      });

      // Track update notification shown
      trackUserInteraction.updateNotificationShown(versionCheck.latestVersion);
    }
  }, [versionCheck.hasUpdate, versionCheck.latestVersion, toast]);

  // Handle update icon click - reload page when update is available
  const handleUpdateIconClick = () => {
    if (versionCheck.hasUpdate) {
      trackUserInteraction.updateApplied(
        versionCheck.latestVersion || 'unknown'
      );
      window.location.reload();
    }
  };

  // Get the appropriate icon based on version status
  const getVersionIcon = () => {
    if (versionCheck.isChecking) {
      return <RefreshCw className="size-6 animate-spin text-blue-500" />;
    }
    if (versionCheck.hasUpdate) {
      return (
        <div title="Click to update to the latest version">
          <AlertCircle
            className="size-6 text-orange-500 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={handleUpdateIconClick}
          />
        </div>
      );
    }
    if (versionCheck.latestVersion && !versionCheck.hasUpdate) {
      return <CheckCircle className="size-6 text-green-500" />;
    }
    return null;
  };

  // Get tooltip text for version status
  const getVersionTooltip = () => {
    return getVersionStatusMessage(versionCheck);
  };

  return (
    // Container for version text and settings trigger, aligned horizontally
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Display the current app version with status icon */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[1.75rem] text-muted-foreground/50 font-code hover:text-muted-foreground transition-colors"
          title={getVersionTooltip()}
        >
          {appVersion}
        </a>
        {getVersionIcon()}
      </div>
      {/* Settings panel trigger button */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            onClick={handleSettingsOpen}
            className="text-muted-foreground hover:text-foreground transition-colors bg-white/20 rounded-full p-2"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="abbreviate-day">
                  Abreviar Día (3 caracteres)
                </Label>
                <Switch
                  id="abbreviate-day"
                  checked={abbreviateDay}
                  onCheckedChange={(checked) => {
                    setAbbreviateDay(checked);
                    trackUserInteraction.abbreviateDayToggle(checked);
                  }}
                />
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
                    <Label htmlFor="short">3 caracteres</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="numeric" id="numeric" />
                    <Label htmlFor="numeric">Numérico (2 dígitos)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

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
                    trackUserInteraction.timeFormatChange(
                      value as '12h' | '24h'
                    );
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
                  onCheckedChange={(checked) => {
                    setShowSeconds(checked);
                    trackUserInteraction.secondsToggle(checked);
                  }}
                />
              </div>
            </div>

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
                    <SelectItem value="5">5 minutos (por defecto)</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="0">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
              <div className="grid gap-3">
                <Label>Intervalo de Verificación de Actualizaciones</Label>
                <Select
                  value={String(updateCheckInterval)}
                  onValueChange={(value) => {
                    const numValue = Number(value);
                    setUpdateCheckInterval(numValue);
                    trackUserInteraction.updateCheckIntervalChange(numValue);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar intervalo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">
                      Cada 5 minutos (por defecto)
                    </SelectItem>
                    <SelectItem value="15">Cada 15 minutos</SelectItem>
                    <SelectItem value="30">Cada 30 minutos</SelectItem>
                    <SelectItem value="60">Cada hora</SelectItem>
                    <SelectItem value="120">Cada 2 horas</SelectItem>
                    <SelectItem value="360">Cada 6 horas</SelectItem>
                    <SelectItem value="720">Cada 12 horas</SelectItem>
                    <SelectItem value="0">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
