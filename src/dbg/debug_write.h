#pragma once

#ifdef SPECULOS
void debug_write(char *buf);
#define DEBUG(_s) debug_write(_s)
#else
// If SPECULOS is set, uses QEMU's semi-hosting feature to write a string on the terminal.
// If SPECULOS is not set, does nothing.
#define DEBUG(_s)
#endif

int semihosted_printf(const char *format, ...);
