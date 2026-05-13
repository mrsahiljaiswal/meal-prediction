package com.luminescent.pos.service;

import com.luminescent.pos.entity.Unit;
import jakarta.persistence.Enumerated;
import org.springframework.stereotype.Service;

@Service
public class UnitConversionService {

    public static double normalize(double quantity, Unit unit) {

        return switch (unit) {

            case KG -> quantity * 1000;

            case LITER -> quantity * 1000;

            case GRAM, ML, PIECE -> quantity;

        };
    }
}
