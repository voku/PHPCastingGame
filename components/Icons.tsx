import React from 'react';
import { Hammer, Ruler, AlertTriangle, CheckCircle, XCircle, ArrowRight, Activity, Terminal, Clock, Sun, Moon } from 'lucide-react';

export const HammerIcon = ({ className }: { className?: string }) => <Hammer className={className} />;
export const RulerIcon = ({ className }: { className?: string }) => <Ruler className={className} />;
export const WarningIcon = ({ className }: { className?: string }) => <AlertTriangle className={className} />;
export const SuccessIcon = ({ className }: { className?: string }) => <CheckCircle className={className} />;
export const FailIcon = ({ className }: { className?: string }) => <XCircle className={className} />;
export const ArrowRightIcon = ({ className }: { className?: string }) => <ArrowRight className={className} />;
export const ActivityIcon = ({ className }: { className?: string }) => <Activity className={className} />;
export const TerminalIcon = ({ className }: { className?: string }) => <Terminal className={className} />;
export const ClockIcon = ({ className }: { className?: string }) => <Clock className={className} />;
export const SunIcon = ({ className }: { className?: string }) => <Sun className={className} />;
export const MoonIcon = ({ className }: { className?: string }) => <Moon className={className} />;