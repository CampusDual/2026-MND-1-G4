package com.campusdual.cd2026mnd1g4.model.repository;

import com.campusdual.cd2026mnd1g4.model.entity.ManagerProfileEntity;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface ManagerProfileRepository extends Repository<ManagerProfileEntity, Long> {

    List<ManagerProfileEntity> findAllByDistributor_Id(Long distributorId);

    Optional<ManagerProfileEntity> findByIdAndDistributor_Id(Long id, Long distributorId);

    Optional<ManagerProfileEntity> findByUser_IdAndDistributor_Id(Long userId, Long distributorId);

    ManagerProfileEntity save(ManagerProfileEntity managerProfile);
}
