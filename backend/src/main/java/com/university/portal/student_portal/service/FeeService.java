package com.university.portal.student_portal.service;

import com.university.portal.student_portal.dto.FeeDto;
import com.university.portal.student_portal.entity.Fee;
import com.university.portal.student_portal.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeService {
    
    private final FeeRepository feeRepository;
    
    public List<FeeDto> getAllFees() {
        return feeRepository.findAll().stream()
                .map(FeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<FeeDto> getActiveFees() {
        return feeRepository.findByIsActiveTrue().stream()
                .map(FeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<FeeDto> getFeesByType(Fee.FeeType feeType) {
        return feeRepository.findByFeeType(feeType).stream()
                .map(FeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Optional<FeeDto> getFeeById(Long id) {
        return feeRepository.findById(id)
                .map(FeeDto::fromEntity);
    }
    
    public Optional<FeeDto> getFeeByCode(String feeCode) {
        return feeRepository.findByFeeCode(feeCode)
                .map(FeeDto::fromEntity);
    }
    
    public FeeDto createFee(FeeDto feeDto) {
        if (feeRepository.existsByFeeCode(feeDto.getFeeCode())) {
            throw new IllegalArgumentException("Fee with code " + feeDto.getFeeCode() + " already exists");
        }
        
        Fee fee = feeDto.toEntity();
        Fee savedFee = feeRepository.save(fee);
        return FeeDto.fromEntity(savedFee);
    }
    
    public FeeDto updateFee(Long id, FeeDto feeDto) {
        Fee existingFee = feeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fee not found with id: " + id));
        
        // Check if fee code is being changed and if it already exists
        if (!existingFee.getFeeCode().equals(feeDto.getFeeCode()) && 
            feeRepository.existsByFeeCode(feeDto.getFeeCode())) {
            throw new IllegalArgumentException("Fee with code " + feeDto.getFeeCode() + " already exists");
        }
        
        existingFee.setFeeCode(feeDto.getFeeCode());
        existingFee.setFeeName(feeDto.getFeeName());
        existingFee.setDescription(feeDto.getDescription());
        existingFee.setAmount(feeDto.getAmount());
        existingFee.setFeeType(feeDto.getFeeType());
        existingFee.setIsActive(feeDto.getIsActive());
        
        Fee updatedFee = feeRepository.save(existingFee);
        return FeeDto.fromEntity(updatedFee);
    }
    
    public void deleteFee(Long id) {
        if (!feeRepository.existsById(id)) {
            throw new IllegalArgumentException("Fee not found with id: " + id);
        }
        feeRepository.deleteById(id);
    }
    
    public void deactivateFee(Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fee not found with id: " + id));
        fee.setIsActive(false);
        feeRepository.save(fee);
    }
} 