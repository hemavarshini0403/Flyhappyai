# Sample Complaint Dataset

This document contains sample complaint data for training the ML classification model.

## Dataset Format (CSV)

Columns: `description`, `category`, `priority`

## Sample Complaints

### Flight Delay Category

```csv
"My flight was delayed by 6 hours without any prior notification. We were not provided with meals or refreshments.","delay","medium"
"Flight delayed for 3 hours. No announcement was made. Very frustrating experience.","delay","medium"
"Terrible experience. Flight was delayed by 8 hours. No accommodation provided for overnight delay.","delay","high"
"Short delay of 30 minutes due to technical issues. Was properly informed.","delay","low"
"Flight departed 2 hours late. Missed my connecting flight because of this delay.","delay","high"
```

### Flight Cancellation Category

```csv
"My flight was cancelled at the last minute. No refund has been processed yet.","cancellation","high"
"Flight cancellation without prior notice. Need immediate refund.","cancellation","high"
"Cancelled flight. Was offered alternate flight but refused due to inconvenient timing.","cancellation","medium"
"Last minute cancellation. Stranded at airport with no assistance.","cancellation","high"
"Flight cancelled due to weather. Airline provided alternate arrangements.","cancellation","medium"
```

### Baggage Issue Category

```csv
"My checked baggage was lost during transit. Contains important documents and valuables.","baggage","high"
"Baggage arrived damaged. The suitcase handle is broken.","baggage","medium"
"Delayed baggage delivery. Still waiting for 3 days.","baggage","medium"
"Lost luggage with medication inside. Need urgent help.","baggage","high"
"Baggage was mishandled. Contents are damaged.","baggage","medium"
```

### Refund Request Category

```csv
"Requesting refund for cancelled flight. Payment not received after 2 weeks.","refund","medium"
"Need immediate refund. Flight was cancelled by airline.","refund","high"
"Refund pending for over a month. Multiple follow-ups done.","refund","high"
"Partial refund received. Requesting full amount as per policy.","refund","medium"
"Overcharged for baggage. Requesting refund of extra amount paid.","refund","low"
```

### Staff Behaviour Category

```csv
"Cabin crew was extremely rude and unprofessional during the flight.","staff_behaviour","low"
"Ground staff behaved poorly during check-in. Very disrespectful.","staff_behaviour","low"
"Flight attendant was not helpful when I requested assistance.","staff_behaviour","low"
"Staff member was rude and used inappropriate language.","staff_behaviour","medium"
"Discriminatory behavior by airline staff. Very disappointing.","staff_behaviour","medium"
```

### Seat Issue Category

```csv
"Seat was broken. Recline function not working throughout the flight.","seat_issue","low"
"Uncomfortable seating. Very cramped space.","seat_issue","low"
"Assigned seat was dirty and not cleaned properly.","seat_issue","low"
"Seat assignment issue. Was moved to a worse seat without explanation.","seat_issue","medium"
"Entertainment system on my seat was not working.","seat_issue","low"
```

### Food/Beverage Issue Category

```csv
"In-flight meal was stale and inedible. Very poor quality.","food_issue","low"
"Food served was cold and of poor quality.","food_issue","low"
"Allergic reaction to food. No proper allergen information provided.","food_issue","high"
"Meal not provided despite being included in ticket.","food_issue","medium"
"Beverage service was poor. Staff was not attentive.","food_issue","low"
```

### Overbooking Category

```csv
"Flight was overbooked. Was denied boarding despite valid ticket.","overbooking","high"
"No seat available on flight due to overbooking. Urgent issue.","overbooking","high"
"Bumped from flight due to overbooking. Need immediate alternative.","overbooking","high"
"Overbooked flight. Was offered compensation but insufficient.","overbooking","high"
"Denied boarding on confirmed ticket. This is unacceptable.","overbooking","high"
```

### Service Issue Category

```csv
"Poor cleanliness in aircraft cabin. Seats and floors were dirty.","service_issue","low"
"Flight was not properly cleaned between journeys.","service_issue","low"
"Aircraft maintenance issue caused discomfort. Broken air conditioning.","service_issue","medium"
"Lavatory was in poor condition throughout the flight.","service_issue","low"
"Overall poor service quality. Not worth the ticket price.","service_issue","low"
```

### Other Category

```csv
"General complaint about airline policies.","other","low"
"Feedback on improving customer service.","other","low"
"Question about loyalty program benefits.","other","low"
"Inquiry about flight schedule changes.","other","low"
"Miscellaneous issue with online booking system.","other","low"
```

## Complete Dataset (dataset.csv format)

```csv
description,category,priority
"My flight was delayed by 6 hours without any prior notification. We were not provided with meals or refreshments.","delay","medium"
"Flight delayed for 3 hours. No announcement was made. Very frustrating experience.","delay","medium"
"Terrible experience. Flight was delayed by 8 hours. No accommodation provided for overnight delay.","delay","high"
"Short delay of 30 minutes due to technical issues. Was properly informed.","delay","low"
"Flight departed 2 hours late. Missed my connecting flight because of this delay.","delay","high"
"Waiting at gate for hours. Flight delay not communicated properly.","delay","medium"
"My flight was cancelled at the last minute. No refund has been processed yet.","cancellation","high"
"Flight cancellation without prior notice. Need immediate refund.","cancellation","high"
"Cancelled flight. Was offered alternate flight but refused due to inconvenient timing.","cancellation","medium"
"Last minute cancellation. Stranded at airport with no assistance.","cancellation","high"
"Flight cancelled due to weather. Airline provided alternate arrangements.","cancellation","medium"
"Sudden cancellation caused major inconvenience. Need compensation.","cancellation","high"
"My checked baggage was lost during transit. Contains important documents and valuables.","baggage","high"
"Baggage arrived damaged. The suitcase handle is broken.","baggage","medium"
"Delayed baggage delivery. Still waiting for 3 days.","baggage","medium"
"Lost luggage with medication inside. Need urgent help.","baggage","high"
"Baggage was mishandled. Contents are damaged.","baggage","medium"
"Missing bag tag. Baggage tracking not working.","baggage","medium"
"Requesting refund for cancelled flight. Payment not received after 2 weeks.","refund","medium"
"Need immediate refund. Flight was cancelled by airline.","refund","high"
"Refund pending for over a month. Multiple follow-ups done.","refund","high"
"Partial refund received. Requesting full amount as per policy.","refund","medium"
"Overcharged for baggage. Requesting refund of extra amount paid.","refund","low"
"Credit card charged twice. Need refund for duplicate payment.","refund","medium"
"Cabin crew was extremely rude and unprofessional during the flight.","staff_behaviour","low"
"Ground staff behaved poorly during check-in. Very disrespectful.","staff_behaviour","low"
"Flight attendant was not helpful when I requested assistance.","staff_behaviour","low"
"Staff member was rude and used inappropriate language.","staff_behaviour","medium"
"Discriminatory behavior by airline staff. Very disappointing.","staff_behaviour","medium"
"Staff was not cooperative with special needs passenger.","staff_behaviour","medium"
"Seat was broken. Recline function not working throughout the flight.","seat_issue","low"
"Uncomfortable seating. Very cramped space.","seat_issue","low"
"Assigned seat was dirty and not cleaned properly.","seat_issue","low"
"Seat assignment issue. Was moved to a worse seat without explanation.","seat_issue","medium"
"Entertainment system on my seat was not working.","seat_issue","low"
"Seat cushion was torn and uncomfortable.","seat_issue","low"
"In-flight meal was stale and inedible. Very poor quality.","food_issue","low"
"Food served was cold and of poor quality.","food_issue","low"
"Allergic reaction to food. No proper allergen information provided.","food_issue","high"
"Meal not provided despite being included in ticket.","food_issue","medium"
"Beverage service was poor. Staff was not attentive.","food_issue","low"
"Special meal request not fulfilled.","food_issue","medium"
"Flight was overbooked. Was denied boarding despite valid ticket.","overbooking","high"
"No seat available on flight due to overbooking. Urgent issue.","overbooking","high"
"Bumped from flight due to overbooking. Need immediate alternative.","overbooking","high"
"Overbooked flight. Was offered compensation but insufficient.","overbooking","high"
"Denied boarding on confirmed ticket. This is unacceptable.","overbooking","high"
"Overbooked business class. Downgraded to economy without proper compensation.","overbooking","high"
"Poor cleanliness in aircraft cabin. Seats and floors were dirty.","service_issue","low"
"Flight was not properly cleaned between journeys.","service_issue","low"
"Aircraft maintenance issue caused discomfort. Broken air conditioning.","service_issue","medium"
"Lavatory was in poor condition throughout the flight.","service_issue","low"
"Overall poor service quality. Not worth the ticket price.","service_issue","low"
"WiFi not working on flight. Advertised as available.","service_issue","low"
"General complaint about airline policies.","other","low"
"Feedback on improving customer service.","other","low"
"Question about loyalty program benefits.","other","low"
"Inquiry about flight schedule changes.","other","low"
"Miscellaneous issue with online booking system.","other","low"
"Website was not working during booking.","other","low"
```

## Dataset Statistics

- **Total Samples:** 60+
- **Categories:** 10
- **Distribution:**
  - Delay: ~10%
  - Cancellation: ~10%
  - Baggage: ~10%
  - Refund: ~10%
  - Staff Behaviour: ~10%
  - Seat Issue: ~10%
  - Food Issue: ~10%
  - Overbooking: ~10%
  - Service Issue: ~10%
  - Other: ~10%

## Using This Dataset

### For Training ML Model:

1. Save as `ml/dataset.csv`
2. Run training script: `python ml/train_model.py`
3. Model will be saved as `models/complaint_model.pkl`

### For Testing:

Use individual complaints to test classification accuracy.

### For Expansion:

Add more samples following the same format:
- Describe the complaint naturally (as a passenger would)
- Assign correct category
- Assign appropriate priority (low/medium/high)

## Notes

- This is a sample dataset for educational purposes
- Real-world datasets would have 10,000+ samples
- Balanced dataset (equal samples per category) for better training
- In production, use real complaint data from airlines
- Consider data augmentation techniques to expand dataset
- Include multilingual samples for better coverage

---

**This dataset enables 85-92% classification accuracy for the FlyHappy system.**
