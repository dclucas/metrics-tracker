# Metrics tracker

*An unopinionated service for development metrics collection*

## Why

This tool was built with the following traits in mind:
* *Minimal*: the tracker does not perform metrics gathering (there are great tools out there for that) or analysis. This constraint drives the points below...
* *Simple*: simple to plug into your process (a straightforward CURL is enough to upload data), simple to query (GraphQL endpoint), simple internals (modular design);
* *Extensible*: as metrics are generated outside this service, plugging in your favorite linting/testing/etc is straightforward;
* *Flexible*: you can gather metrics at any moment in the dev process (eg: your IDE could push dev metrics, your tracking tool as well) and cross-reference them;

## How

Metrics tracker is composed of the following modules:
* An HTTP API that accepts POST requests for report uploads (and direct JSON insert operations). This API is add-only and has plugins to parse different reporting formats;
* A GraphQL API to query subject (your app, repo or whatever you choose to track) status
* A React front end to show the collected metrics

In the future, it will also contain:
* An InfluxDB datastore for time series analysis on the metrics
* An event broker (TBD) to allow for easy extensibility and more reliability;

## What

These are the core concepts in metrics tracker:
* A **subject** is the source for your metrics tracking. It can be a repo, a project or anything you have metrics for. Subjects may also exist in a hierarchy;
* An **assessment** is a data collection exercise, such as a build;
* A **measurement** is a data point for a *metric*, collected during an _assessment_.
* A **metric** describes a trait in your *subject* that you want to track.
* A **goal** is a desired target for a metric.

Example: let's say we are running build # 174 for metrics-tracker:
* The *subject* is metrics-tracker;
* The *assessment* is build 174;
* Multiple measurements are collected:
    - For the *metrics* `passing tests`: a measurement valued at 314 (type: `COUNT`) is collected;
    - For the *metrics* `code coverage`: a measurement valued at .97 (type: `PERCENTAGE`) is collected;
* Only `code coverage` had an associated go (>= 90%) so this measurement has met the goal;
