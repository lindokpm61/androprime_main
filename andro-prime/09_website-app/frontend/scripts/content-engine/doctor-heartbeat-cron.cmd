@echo off
REM ============================================================================
REM  doctor-heartbeat-cron.cmd - Windows Task Scheduler calls this.
REM
REM  WHAT IT WATCHES: whether content-doctor is still RUNNING AT ALL. Not what
REM  the doctor found - it never reads an invariant. See doctor-heartbeat.ts.
REM
REM  THE ACTION STRING THAT REGISTERS THIS TASK MATTERS, and getting it wrong is
REM  silent. Use the `call` form:
REM
REM      cmd.exe /c call "<this file>" >> "<log>" 2>&1
REM
REM  NOT this, which is how content-doctor was registered on 2026-08-01 and why
REM  it did not run for four nights:
REM
REM      cmd.exe /c "<this file>" >> "<log>" 2>&1
REM
REM  When the string after /c begins with a quote, cmd.exe strips the outermost
REM  quote pair of the whole remaining string, producing a command with an
REM  unbalanced quote. It fails BEFORE the redirect is set up, so there is no log
REM  line, no error and no output anywhere: the job simply never starts, while
REM  the task definition on disk still reads as perfectly healthy.
REM
REM  SAME WORKING-DIRECTORY TRAP as content-doctor-cron.cmd: loadEnvLocal() reads
REM  .env.local from process.cwd(), so a wrong cwd means no credentials. The cwd
REM  is derived from THIS SCRIPT'S OWN LOCATION (%~dp0), never from the caller.
REM
REM  KEEP THIS FILE CRLF AND ASCII-ONLY. cmd.exe mis-parses LF-only batch files.
REM
REM  EXIT CODES are the heartbeat's own:
REM      0  the doctor ran inside the window
REM      2  STALE or NEVER RUN - the board is unwatched
REM      1  UNKNOWN - the heartbeat could not be taken (not a pass, not an alarm)
REM ============================================================================

setlocal

pushd "%~dp0..\.."
if errorlevel 1 goto badcwd
if not exist "package.json" goto nopkg
if not exist "scripts\content-engine\doctor-heartbeat.ts" goto noscript

echo [doctor-heartbeat] %DATE% %TIME%  cwd=%CD%

call npx tsx "scripts\content-engine\doctor-heartbeat.ts" --log %*
set "HB_EXIT=%ERRORLEVEL%"

echo [doctor-heartbeat] finished with exit %HB_EXIT%
popd
endlocal & exit /b %HB_EXIT%

:badcwd
echo [doctor-heartbeat] FATAL: could not enter "%~dp0..\.." 1>&2
endlocal & exit /b 1

:nopkg
echo [doctor-heartbeat] FATAL: no package.json in "%CD%". Expected 09_website-app\frontend. 1>&2
popd
endlocal & exit /b 1

:noscript
echo [doctor-heartbeat] FATAL: "%CD%" has a package.json but not the content-engine scripts. 1>&2
popd
endlocal & exit /b 1
