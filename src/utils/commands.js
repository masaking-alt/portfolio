import { works } from '../works';

export function getWorkFromCliTarget(target) {
  const normalizedTarget = target.trim().toLowerCase();
  if (!normalizedTarget) {
    return null;
  }

  if (/^\d+$/.test(normalizedTarget)) {
    return works[Number(normalizedTarget) - 1] ?? null;
  }

  return works.find((work) => work.id.toLowerCase() === normalizedTarget) ?? null;
}

export function getOpenTargetFromCommand(command) {
  if (command.startsWith('/open/')) {
    return command.slice('/open/'.length);
  }

  if (command.startsWith('/open ')) {
    return command.slice('/open '.length);
  }

  return null;
}

export function getCliPathFromCommand(command) {
  if (command === '/top') {
    return '/';
  }
  if (command === '/works') {
    return '/works';
  }
  if (command === '/about') {
    return '/about';
  }
  if (command === '/contact') {
    return '/contact';
  }
  return null;
}
