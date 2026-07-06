---
title: "MPG vs L/100km: one of these numbers is lying to you"
description: "Miles per gallon feels intuitive, but its inverse scale distorts how much fuel you actually save. Here's why L/100km tells the truth."
pubDate: 2026-07-01
tags: ["fuel-economy", "units"]
---

Ask two drivers which upgrade saves more fuel and most will get this wrong:

- Swapping a 10 MPG truck for a 15 MPG truck, or
- swapping a 30 MPG car for a 50 MPG car?

The second jump *sounds* bigger — 20 MPG of improvement against 5. But over the
same 10,000 miles, the truck swap saves about **333 gallons**, while the car swap
saves about **133**. The truck upgrade is two and a half times more valuable.

## Why MPG misleads

MPG measures *distance per fuel*. Consumption — what you actually pay for — is
*fuel per distance*, its inverse. And an inverse doesn't scale linearly: going
from 10 to 15 MPG cuts consumption by a third, while going from 30 to 50 MPG
cuts a much smaller absolute amount, because there was less fuel being burned
in the first place.

Plotted on a chart, real savings per MPG gained form a steep curve that flattens
fast. The difference between 40 and 60 MPG barely moves your annual fuel bill;
the difference between 12 and 18 MPG transforms it.

## L/100km can't play this trick

Litres per 100 kilometres is already *fuel per distance*. Halve the number,
halve your fuel bill — every time, at any point on the scale. That's why most of
the world (and every engineer) uses it, and why the EPA now prints gallons per
100 miles alongside MPG on new-car labels in the US.

## What this means in Pumpa

Pumpa stores consumption internally as L/100km and converts on the way in and
out, so switching between Metric, US and UK keeps the math honest — including
the inverse MPG conversion. Enter your consumption in whichever unit you think
in; the trip costs come out the same either way.

The next time you compare two cars, convert both to L/100km (or gallons per 100
miles) first. The cheaper car to run is the one with the lower *consumption* —
not necessarily the one with the flashier MPG number.
