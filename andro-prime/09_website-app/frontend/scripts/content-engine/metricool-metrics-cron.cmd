@echo off
REM ============================================================================
REM  metricool-metrics-cron.cmd - the ONE thing Windows Task Scheduler calls.
REM
REM  WHY THIS FILE EXISTS: THE WORKING-DIRECTORY TRAP. Task Scheduler leaves
REM  "Start in" optional, and blank means the task runs from C:\Windows\System32.
REM  The cwd is therefore derived from THIS SCRIPT'S OWN LOCATION (%~dp0), which
REM  is correct no matter who invokes it or from where.
REM
REM      %~dp0 = ...\09_website-app\frontend\scripts\content-engine\
REM      ..\.. = ...\09_website-app\frontend            <- the required cwd
REM
REM  KEEP THIS FILE CRLF AND ASCII-ONLY. cmd.exe mis-parses LF-only batch files
REM  and mangles non-ASCII under a non-UTF8 codepage.
REM
REM  EXIT CODES are the job's own, propagated unchanged, so Task Scheduler's
REM  "Last Run Result" column is meaningful:
REM      0  every published post that could be measured was measured
REM      2  a capture FAILED to write: the numbers were fetched and then lost
REM      3  work owed: a post passed its seven-day mark with no datapoint near it
REM      1  the run itself failed (bad cwd, missing credentials, crash)
REM
REM  WHY IT RUNS DAILY, and it is not "to be current". The 30-day carousel run
REM  compares three closing slides, and close A's ten posts average run-day 14.5
REM  against close C's 16.5, so comparing running totals at one moment ranks the
REM  closes by publish date. The comparison has to be at a FIXED AGE (saves at
REM  seven days), which is a requirement on the CADENCE. A daily capture is what
REM  guarantees every post has a datapoint within a day of its own mark, and a
REM  missed one cannot be backfilled: Metricool holds running totals, so a number
REM  can be recovered later, but a reading AT an age cannot.
REM
REM  It runs AFTER metricool-writeback (07:00) on purpose: metrics are joined on
REM  the platform's own post id, which is read out of external_url, and the
REM  write-back is what records that URL. Reversing the order would leave every
REM  post unmeasurable on its first day.
REM
REM  This job only READS Metricool and writes our own database. It never creates,
REM  edits or publishes a post, which is why it is safe on a timer where
REM  metricool-schedule deliberately is not.
REM
REM  Register it with the command in 12_operations/automation/scheduled-agents.md;
REM  this file does not register itself.
REM ============================================================================

setlocal

REM --- Pin the working directory to frontend/, derived from this script's path.
pushd "%~dp0..\.."
if errorlevel 1 goto badcwd
if not exist "package.json" goto nopkg
if not exist "scripts\content-engine\metricool-metrics.ts" goto noscript

echo [metricool-metrics-cron] %DATE% %TIME%  cwd=%CD%

REM --- Run it. --log writes the single agent_runs telemetry row. Extra args pass
REM     straight through, so `metricool-metrics-cron.cmd --dry-run` works.
call npx tsx "scripts\content-engine\metricool-metrics.ts" --log %*
set "MX_EXIT=%ERRORLEVEL%"

echo [metricool-metrics-cron] finished with exit %MX_EXIT%
popd
endlocal & exit /b %MX_EXIT%

:badcwd
echo [metricool-metrics-cron] FATAL: could not enter "%~dp0..\.." 1>&2
endlocal & exit /b 1

:nopkg
echo [metricool-metrics-cron] FATAL: no package.json in "%CD%". 1>&2
echo [metricool-metrics-cron] Expected the 09_website-app\frontend directory. 1>&2
popd
endlocal & exit /b 1

:noscript
echo [metricool-metrics-cron] FATAL: "%CD%" has a package.json but not the content-engine scripts. 1>&2
popd
endlocal & exit /b 1
